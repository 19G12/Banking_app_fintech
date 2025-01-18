const Header = ({type="title", title, user, subtext}: HeaderProps)=> {
  return (
    <div className="header-box">
        <h1 className="header-box-title">
        {title} 
        {type === "greeting" && <span className="text-bankGradient">{" "}{user}</span>} 
        </h1>
        <p className="header-box-subtext">
            {subtext}
        </p>
    </div>
  )
}

export default Header