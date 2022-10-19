import "./css/index.css"
import Imask from "imask"

const ccBg01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBg02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:last-child img")
const background = document.querySelector(".cc")
const inputCard = document.getElementById("card-number")
const securityCode = document.getElementById("security-code")
const expiratitonDate = document.getElementById("expiration-date")
const cardNumber = document.getElementById("card-number")

function setCard(type) {
  const colors = {
    // visa: ["#2D57F2", "#436D99"],
    visa: [
      {
        colors: ["#2D57F2", "#436D99"],
        background: "url('../public/bg-visa.svg')",
      },
    ],
    mastercard: [
      {
        colors: ["#C69347", "#DF6F29"],
        background: "blue",
      },
    ],
    // elo: [],
    // default: ["#323238", "#121214"],
    default: [
      {
        colors: ["#323238", "#121214"],
        background: "url('../public/bg-default.svg')",
      },
    ],
  }

  ccBg01.setAttribute("fill", colors[type][0])
  ccBg02.setAttribute("fill", colors[type][1])
  // background.style.backgroundColor = colors[type][0].background
  background.style.backgroundImage = colors[type][0].background
  ccLogo.setAttribute("src", `./public/cc-${type}.svg`)
}
globalThis.setCard = setCard
// setCard("elo")

// setCard("mastercard")

// inputCard.addEventListener("input", (event) => {
//   // console.log(event.currentTarget.slice(0, 2))
//   if (event.currentTarget.value.slice(0, 2) === "12") {
//     setCard("visa")
//   } else if (event.currentTarget.value === "2") {
//     setCard("mastercard")
//   } else {
//     setCard("default")
//   }
// })

const securityCodeMasked = Imask(securityCode, { mask: "0000" })
const expiratitonDateMasked = Imask(expiratitonDate, {
  mask: "MM{/}YY",
  lazy: false,
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: Number(new Date().getUTCFullYear().toString().slice(2)),
      to: Number(new Date().getUTCFullYear().toString().slice(2)) + 10,
    },
  },
})
const cardNumberMasked = Imask(cardNumber, {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = dynamicMasked.value + appended
    const foundMask = dynamicMasked.compiledMasks.find((item) => {
      const teste2 = number.match(item.regex)
      console.log(teste2)
      return teste2
    })
    console.log(foundMask)
    setCard(foundMask.cardtype)
    return foundMask
  },
})
const typeCard = cardNumberMasked.masked.currentMask.cardtype
console.log(typeCard)
// setCard(typeCard)

// console.log(new Date().getUTCFullYear())
// console.log(securityCodeMasked)
