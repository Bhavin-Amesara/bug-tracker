const DashboardCard = ({ title, value, name }) => {
    return (
        <div className="cards">
        <div className="carditem">
            <div className="cardtitle">{title}</div>
            <div className="cardname">{name}</div>
            <div className="cardcount">{value}</div>
        </div>
        </div>
    );
};

export default DashboardCard;