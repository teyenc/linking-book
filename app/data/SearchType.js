const image1 = require("../asset/explore/coding.jpeg")
const image2 = require("../asset/explore/design.jpg")
const image3 = require("../asset/explore/stock.jpg")
const image4 = require("../asset/explore/business.jpeg")
const image5 = require("../asset/explore/startup.jpg")
const image6 = require("../asset/explore/tech.jpg")

export const SearchType = [
    {
      id:3,
      name:"Coding",
      // image:require("../asset/explore/coding.jpeg"),
      image: image1
    },
    {
      id:28,
      name:"Design",
      // image:require("../../asset/explore/design.jpg"),
      image: image2
    },
    {
      id:34,
      name:"Stock",
      // image:require("../../asset/explore/stock.jpg"),
      image: image3
    },
    {
      id:22,
      name:"Business",
      // image:require("../../asset/explore/business.jpeg"),
      image: image4
    },
    {
      id:24,
      name:"Startups",
      // image:require("../../asset/explore/startup.jpg"),
      image: image5
    },
    {
      id:12,
      name:"Technology",
      // image:require("../../asset/explore/tech.jpg"),
      image: image6
    },
  ]

export default SearchType;