/* eslint-disable react-hooks/exhaustive-deps */
import {
  create,
  get,
  parseCreationOptionsFromJSON,
  parseRequestOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";

const FidoAuth = () => {
  function getRegistrations(): [] {
    const registrations = JSON.parse(
      localStorage.webauthnExampleRegistrations || "[]"
    );
    return registrations;
  }
  function registeredCredentials() {
    return getRegistrations().map((reg: any) => ({
      id: reg.rawId,
      type: reg.type,
    }));
  }

  async function register(): Promise<void> {
    const cco = parseCreationOptionsFromJSON({
      publicKey: {
        challenge: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        rp: { name: "Localhost, Inc." },
        user: {
          id: "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
          name: "test_user",
          displayName: "Test User",
        },
        pubKeyCredParams: [],
        excludeCredentials: registeredCredentials(),
        authenticatorSelection: { userVerification: "discouraged" },
        extensions: {
          credProps: true,
        },
      },
    });
    await create(cco);
  }

  async function authenticate(options?: {
    conditionalMediation?: boolean;
  }): Promise<any> {
    const cro = parseRequestOptionsFromJSON({
      publicKey: {
        challenge: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        allowCredentials: registeredCredentials(),
        userVerification: "discouraged",
      },
    });
    return get(cro);
  }

  return (
    <div>
      <p>FIDO Auth</p>
      <button onClick={register} className="btn btn-success me-5">
        Register
      </button>
      <button
        type="submit"
        onClick={() => authenticate()}
        className="btn btn-info ms-5"
      >
        Authenticate
      </button>
    </div>
  );
};

export default FidoAuth;
