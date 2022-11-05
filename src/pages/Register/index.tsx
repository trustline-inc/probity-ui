import { useState } from "react"
import { Card } from "react-bootstrap"
import { useHistory, Link } from "react-router-dom"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import logo from "../../assets/logo.png"
import axios from "axios";

export default function Register(props: any) {
  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const history = useHistory()

  const register = async () => {
    const response = await axios("http://localhost:8080/v1/users/register", {
      method: "POST",
      data: {
        legal_name: name,
        email,
        password
      }
    })
    if (response.status === 200) {
      props.setAuth(response.data)
      history.push("/profile")
    }
  }

  return (
    <div className="h-100 d-flex flex-column justify-content-evenly">
      <Activity active={true} activity={ActivityType.Login} error={props.error}>
        <div className="d-flex justify-content-center align-items-center">
          <Card className="w-100">
            <Card.Body>
              <div className="row mt-3">
                <div className="col-12 text-center">
                  <img src={logo} height="100" width="100" alt="Probity" className="border rounded" />
                  <h1 className="my-4">Probity</h1>
                </div>
              </div>
              <div className="row">
                <div className="offset-2 col-8">
                  <hr />
                </div>
              </div>
              <div className="row my-5">
                <div className="col-4 offset-4">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Legal Name</label>
                      <input type="email" className="form-control" onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <input type="email" className="form-control" onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input type="password" className="form-control" onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <div className="d-grid gap-2 mb-2">
                      <button type="button" onClick={register} className="btn btn-primary">Register</button>
                    </div>
                    <small>Already have an account? <Link to="/login">Login</Link></small>
                  </form>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Activity>
    </div>
  )
}