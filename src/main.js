import "./css/index.css"
const ccBg01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBg02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:last-child img")
const background = document.querySelector(".cc")
const inputCard = document.getElementById("card-number")

function setCard(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: [
      {
        colors: ["#C69347", "#DF6F29"],
        background: "blue",
      },
    ],
    elo: [],
    default: ["#323238", "#121214"],
  }

  ccBg01.setAttribute("fill", colors[type][0])
  ccBg02.setAttribute("fill", colors[type][1])
  background.style.backgroundColor = colors["mastercard"][0].background
  ccLogo.setAttribute("src", `./public/cc-${type}.svg`)
}
globalThis.setCard = setCard
setCard("mastercard")
const string = "2bvv"

// console.log()
inputCard.addEventListener("input", (event) => {
  // console.log(event.currentTarget.slice(0, 2))
  if (event.currentTarget.value.slice(0, 2) === "12") {
    setCard("visa")
  } else if (event.currentTarget.value === "2") {
    setCard("mastercard")
  } else {
    setCard("default")
  }
})
