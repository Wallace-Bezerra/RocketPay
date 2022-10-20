import "./css/index.css"
import Imask from "imask"

const ccBg01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBg02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:last-child img")
const background = document.querySelector(".cc")

const securityCode = document.getElementById("security-code")
const expiratitonDate = document.getElementById("expiration-date")
const cardNumber = document.getElementById("card-number")
const cardHolder = document.getElementById("card-holder")

function setCard(type) {
  const colors = {
    // visa: ["#2D57F2", "#436D99"],
    visa: [
      {
        // colors: ["#2D57F2", "#436D99"],
        background: "url('./bg-visa.svg')",
      },
    ],
    mastercard: [
      {
        // colors: ["#C69347", "#DF6F29"],
        background: "url('./bg-mastercard.svg')",
      },
    ],
    // elo: [],
    // default: ["#323238", "#121214"],
    default: [
      {
        // colors: ["#323238", "#121214"],
        background: "url('./bg-default.svg')",
      },
    ],
  }

  // ccBg01.setAttribute("fill", colors[type][0])
  // ccBg02.setAttribute("fill", colors[type][1])
  // background.style.backgroundColor = colors[type][0].background
  background.style.backgroundImage = colors[type][0].background
  ccLogo.setAttribute("src", `./cc-${type}.svg`)
}
globalThis.setCard = setCard

const securityCodeMasked = Imask(securityCode, { mask: "0000" })
const cardHolderMasked = Imask(cardHolder, { mask: /[a-zA-Z\s]$/ })
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
      return number.match(item.regex)
    })
    return foundMask
  },
})

const addButton = document.querySelector("#add-card")
console.log(addButton)
addButton.addEventListener("click", (e) => {
  e.preventDefault()
  alert("Cartão adicionado!")
})

// cardHolder.addEventListener("input", () => {
//   const ccHolder = document.querySelector(".cc-holder .value")
//   ccHolder.innerText = cardHolder.value.length
//     ? cardHolder.value
//     : "FULANO DA SILVA"
// })
cardHolderMasked.on("accept", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value.length
    ? cardHolder.value
    : "FULANO DA SILVA"
})

securityCodeMasked.on("accept", () => {
  console.log(securityCodeMasked)
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length ? code : "123"
}
cardNumberMasked.on("accept", () => {
  const typeCard = cardNumberMasked.masked.currentMask.cardtype
  setCard(typeCard)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length ? number : "1234 5678 9012 3456"
}

expiratitonDateMasked.on("accept", () => {
  console.log(expiratitonDateMasked.unmaskedValue)
  updateExpirationDate(expiratitonDateMasked.unmaskedValue)
})

function updateExpirationDate(date) {
  const ccDate = document.querySelector(".cc-expiration .value")

  if (date.length > 1) {
    ccDate.innerText = date
  } else if (date === "/") {
    ccDate.innerText = "02/32"
  }
}
