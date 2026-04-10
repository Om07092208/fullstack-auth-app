function Dashboard({ user, onLogout }) {
  return (
    <section className="card dashboard">
      <p className="eyebrow">Authenticated Session</p>
      <h2>{user?.name || "User"} is logged in</h2>
      <p>Email: {user?.email}</p>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </section>
  );
}

export default Dashboard;
