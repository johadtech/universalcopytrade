import '../styles/stats/one.scss'

  const stats = [
    {
        title: "$100M+",
        text: "Paid out to traders",

    },
    {
        title: "180+",
        text: "Countries registered with us",
    },
    {
        title: "13M+",
        text: "Volume of trades monthly",

    },
    {
        title: "3h",
        text: "Avg. payout processing time",
    }
]

const StatsOne = () => {
  return (
   <div className="stats__one__container">
    <div className="stats__one__wrapper">
    <div className="stats__one__stats">
        {stats.map(stat => (
     <span className="stats__one__stat" key={stat.text} >
     <h1>{stat.title}</h1>
     <p>{stat.text}</p>
     </span>
        ))}
    </div>
    </div>
   </div>
  )
}

export default StatsOne