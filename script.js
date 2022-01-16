const colors = {
  "white": "255, 255, 255",
  "light-grey": "162, 162, 162",
  "grey": "107, 107, 107",
  "black": "0, 0, 0",
  "light-orange": "253, 164, 74",
  "yellow": "254, 254, 124",
  "tan": "237, 219, 186",
  "brown": "162, 112, 64",
  "blue-grey": "169, 184, 187",
  "turquoise": "105, 140, 142",
  "pale-blue": "169, 209, 238",
  "light-blue": "70, 210, 252",
  "purple": "113, 27, 207",
  "light-purple": "163, 119, 251",
  "dull-purple": "140, 126, 150",
  "pale-purple": "209, 197, 216",
  "maroon": "137, 4, 4",
  "red": "248, 27, 27",
  "orange": "249, 119, 36",
  "tangerine": "253, 163, 126",
  "army-green": "113, 128, 91",
  "dark-green": "5, 112, 8",
  "green": "68, 208, 70",
  "light-green": "167, 254, 167",
  "blue": "18, 39, 252",
  "dark-blue": "5, 62, 160",
  "wine": "96, 52, 66",
  "dark-purple": "52, 28, 63",
  "pale-pink": "251, 224, 233",
  "light-pink": "253, 166, 253",
  "pink": "249, 120, 209",
  "peach": "252, 209, 166"
}

const minutes = 1 // should use wallpaper engine event listener to get custom amount of minutes

const getRandomPage = (numberOfEntries) => {
  return Math.floor(Math.random() * Math.floor(numberOfEntries / 45))
}

const fetchApi = async () => {
  const numberOfEntries = localStorage.getItem("theunsentproject") ? localStorage.getItem("theunsentproject") : 0

  const uri = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://app-api.theunsentproject.com/posts?skip=${getRandomPage(numberOfEntries)}`)}`

  const data = await fetch(uri)
    .then(response => {
      if (response.ok) return response.json()
      throw new Error('Network response was not ok.')
    })
    .then(data => JSON.parse(data.contents))
    .catch(err => {
      throw new Error(err.message)
    })

  localStorage.setItem("theunsentproject", data.count)

  return data.posts
}

const randomPost = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const getTextColor = (red, green, blue) => {
  return (red * 0.299 + green * 0.587 + blue * 0.114) > 186 ? "#000000" : "#ffffff"
}

void (async () => {
  await main()
  setInterval(async () => {
    await main()
  }, 60000 * minutes)
})()

async function main() {
  try {
    const posts = await fetchApi()
    const post = randomPost(posts)
    setWallpaper(post)
  } catch (err) {
    console.error(err)
  }
}

function setWallpaper(item) {
  const { color,
    createdAt,
    id,
    message,
    name,
    oldPostSlug,
    updatedAt } = item

  const nameHtml = document.getElementById("name")
  const messageHtml = document.getElementById("message")
  const cardContent = document.getElementById("card-content")

  nameHtml.innerHTML = name
  messageHtml.innerHTML = message
  cardContent.style.backgroundColor = `rgba(${colors[color]})`

  const [red, green, blue] = colors[color].split(",")

  messageHtml.style.color = getTextColor(red, green, blue)
}