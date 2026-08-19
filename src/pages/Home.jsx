import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>VEX Ref</h1>
      <p>Referee tools for VEX Robotics competitions.</p>
      <Link to="/teams">Teams</Link>
    </main>
  );
}

export default Home;