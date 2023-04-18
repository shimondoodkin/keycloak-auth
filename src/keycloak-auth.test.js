import { describe, expect, test, jest } from '@jest/globals';
import { authFetch, authFetchJSON, authFetchText, authFetchBlob, authInit, refreshToken, setOnRefreshTokenError,  cleanup } from './keycloak-auth';
import Keycloak from 'keycloak-js';
jest.mock('keycloak-js'); // 'keycloak-js' is now a mock constructor

describe('keycloakAuth', () => {

  describe('authInit', () => {
    afterEach(() => cleanup())

    it('when logged int, should initialize keycloak and return true', async () => {
      const mockInit = jest.fn().mockImplementation(() => { return true });
      Keycloak.mockImplementation(() => {
        return {
          init: mockInit,
        };
      });
      const authenticated = await authInit({ url: 'http://localhost:8080/', realm: 'keycloak-demo', clientId: 'app-vue' });
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(authenticated).toBe(true);

    });

    it('when not logged int, should initialize keycloak and return false, in reality also should redirect', async () => {
      const mockInit = jest.fn().mockImplementation(() => { return false });
      Keycloak.mockImplementation(() => {
        return {
          init: mockInit,
        };
      });
      const authenticated = await authInit({ url: 'http://localhost:8080/', realm: 'keycloak-demo', clientId: 'app-vue' });
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(authenticated).toBe(false);
    });

    it('should throw an error if authentication fails', async () => {
      const mockInit = jest.fn().mockImplementation(() => { throw new Error('some mock error') });
      Keycloak.mockImplementation(() => {
        return {
          init: mockInit,
        };
      });

      await expect(
        authInit({
          url: 'http://localhost:8080/',
          realm: 'non-existent-realm',
          clientId: 'app-vue',
        })
      ).rejects.toThrowError();
    });

  }); // authInit

  async function authenticate() {
    cleanup()
    const mockInit = jest.fn().mockImplementation(() => { return true });
    Keycloak.mockImplementation(() => {
      return {
        init: mockInit,
      };
    });
    const authenticated = await authInit({ url: 'http://localhost:8080/', realm: 'keycloak-demo', clientId: 'app-vue' });
    expect(mockInit).toHaveBeenCalledTimes(1);
    expect(authenticated).toBe(true);
  }

  describe("authFetch function", () => {


    it("should throw an error if not authenticated", async () => {
      await expect(authFetch("http://example.com")).rejects.toThrow(
        "not authenticated yet. the code should call authInit function successfuly first"
      );
    });


    it("should add Authorization header with token", async () => {

      await authenticate();


      const savedFetch = global.fetch;
      const mockFetch = global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ async json() { return {} }, }),
        })
      );
      try {

        const token = "sampleToken123";
        window.keycloak.token = token;

        await authFetch("http://example.com", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        expect(mockFetch).toHaveBeenCalledWith("http://example.com", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      }
      finally {
        global.fetch.mockClear();
        global.fetch = savedFetch;
      }


    });
  });

  describe("authFetchJSON function", () => {
    it("should return JSON response", async () => {

      const mockResponse = { name: "John", age: 30 };

      await authenticate();

      const savedFetch = global.fetch;
      const mockFetch = global.fetch = jest.fn(() =>
        Promise.resolve({
          ok:true,
          status:200,
          json: () => Promise.resolve(mockResponse),
        })
      );
      try {

        const token = "sampleToken123";
        window.keycloak.token = token;

        const result = await authFetchJSON("http://example.com", {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        expect(mockFetch).toHaveBeenCalledWith("http://example.com", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });


        expect(result).toEqual(mockResponse);

      }
      finally {
        global.fetch.mockClear();
        global.fetch = savedFetch;
      }

    });
  });

  describe("authFetchText function", () => {
    it("should return text response", async () => {
      const mockResponse = "sample text response";

      await authenticate();

      const savedFetch = global.fetch;
      const mockFetch = global.fetch = jest.fn(() =>
        Promise.resolve({
          ok:true,
          status:200,
          text: () => Promise.resolve(mockResponse),
        })
      );
      try {

        const token = "sampleToken123";
        window.keycloak.token = token;

        const result = await authFetchText("http://example.com", {
          method: "GET",
          headers: { "Accept": "text/plain" },
        });

        expect(mockFetch).toHaveBeenCalledWith("http://example.com", {
          method: "GET",
          headers: {
            "Accept": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        });

        expect(result).toEqual(mockResponse);

      }
      finally {
        global.fetch.mockClear();
        global.fetch = savedFetch;
      }

    });
  });
    
  describe("authFetchBlob function", () => {
    it("should return blob response", async () => {
      const mockResponse = new Blob(["sample blob response"], { type: "text/plain" });
      
      await authenticate();

      const savedFetch = global.fetch;
      const mockFetch = global.fetch = jest.fn(() =>
        Promise.resolve({
          ok:true,
          status:200,
          blob: () => Promise.resolve(mockResponse),
        })
      );
      try {

        const token = "sampleToken123";
        window.keycloak.token = token;

        const result = await authFetchBlob("http://example.com", {
          method: "GET",
          headers: { "Accept": "text/plain" },
        });

        expect(mockFetch).toHaveBeenCalledWith("http://example.com", {
          method: "GET",
          headers: {
            "Accept": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        });

        expect(result).toEqual(mockResponse);

      }
      finally {
        global.fetch.mockClear();
        global.fetch = savedFetch;
      }

    });
  });

  describe("refreshToken function", () => {
    afterEach(() => keycloak.updateToken.mockClear())
    it("should refresh token successfully", async () => {
      authenticate();
      const updateTokenMock = jest.fn().mockResolvedValueOnce(true);
      keycloak.updateToken = updateTokenMock;
      const refreshed = await refreshToken();
      expect(refreshed).toBe(true);
      expect(updateTokenMock).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if Token refresh failed", async () => {
      authenticate();
      const saveClearTimeout = global.clearTimeout;
      const mockFetch = global.clearTimeout = jest.fn(() =>
        true
      );
      try {
        const error = new Error("some mock error");
        const updateTokenMock = jest.fn().mockRejectedValueOnce(error);
        keycloak.updateToken = updateTokenMock;
        clearTimeout.mockReset();
        await expect(refreshToken()).rejects.toThrow();
        expect(clearTimeout).toHaveBeenCalledTimes(1);
      }
      finally {
        global.clearTimeout.mockClear();
        global.clearTimeout = saveClearTimeout;
      }
    });

    it("should call onRefreshTokenError callback if defined", async () => {
      authenticate();
      const error = new Error("some mock error");
      const updateTokenMock = jest.fn().mockRejectedValueOnce(error);
      keycloak.updateToken = updateTokenMock;
      const onRefreshTokenErrorMock = jest.fn();
      setOnRefreshTokenError(onRefreshTokenErrorMock) ;

      await refreshToken();

      expect(onRefreshTokenErrorMock).toHaveBeenCalledTimes(1);
      // expect(onRefreshTokenErrorMock). .toThrowError( );
    });
  });

});