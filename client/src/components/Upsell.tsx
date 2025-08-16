const Upsell = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-[gray] opacity-90 text-[white] rounded-lg shadow-md">
      <h2>Upgrade to Pro</h2>
      <p>Get access to premium features by upgrading to a Pro account.</p>
      <button className="bg-navbar hover:bg-darkerNavbar px-4 py-2 rounded text-primary font-medium" onClick={() => {window.location.href = "/plans"}}>Upgrade Now</button>
    </div>
  )
}

export default Upsell;