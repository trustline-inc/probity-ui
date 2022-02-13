import { Card } from "react-bootstrap"
import { nanoid } from "nanoid"
import logo from "../../assets/logo.png"
import globalid from "../../assets/globalid_logo.png"

const nonce = nanoid()
const GLOBAL_ID_CONNECT_URL = new URL("https://connect.global.id/")
GLOBAL_ID_CONNECT_URL.searchParams.append("client_id", "11c975d0-6e00-469b-b84c-22f2ab208c7b")
GLOBAL_ID_CONNECT_URL.searchParams.append("response_type", "token")
GLOBAL_ID_CONNECT_URL.searchParams.append("scope", "public")
GLOBAL_ID_CONNECT_URL.searchParams.append("redirect_uri", "http://localhost:3000/login/callback")
GLOBAL_ID_CONNECT_URL.searchParams.append("qr_only", "true")
GLOBAL_ID_CONNECT_URL.searchParams.append("acrc_id", "415d1012-dcc2-4058-a268-15c8b4d76f96")
GLOBAL_ID_CONNECT_URL.searchParams.append("document_id", "tos pp")
GLOBAL_ID_CONNECT_URL.searchParams.append("color", "4eb739")
GLOBAL_ID_CONNECT_URL.searchParams.append("nonce", nonce)

export default function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <Card className="w-100">
        <Card.Body>
          <div className="row mt-3">
            <div className="col-12 text-center">
              <img src={logo} height="100" width="100" alt="Trustline" className="border rounded" />
              <h1 className="my-4">Probity</h1>
            </div>
          </div>
          <div className="row">
            <div className="offset-2 col-8">
              <hr />
            </div>
          </div>
          <div className="row my-5">
            <div className="col-12 text-center">
              <a
                role="button"
                className="btn btn-outline-primary btn-lg"
                href={GLOBAL_ID_CONNECT_URL.href}
                style={{ width: 200 }}
              >
                Log In
              </a>
              <br />
              <br />
              <span className="align-middle">Authentication by</span>{" "}<img src={globalid} height="25" alt="GlobaliD" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}