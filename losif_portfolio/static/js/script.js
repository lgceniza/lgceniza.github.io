const gallery = document.querySelector('#gallery')
const modal = document. querySelector('#galleryModal')
const modalImage = document.querySelector('#modalImg')
const sidebarWidth = "350px";
const sidebar = document.querySelector('#categoryContainer')
let currentImgId = undefined

const categoryList = (await (await fetch("static/category.json")).json())['categoryList']

function populateSideNav() {
    const navList = document.querySelector('#navList')
    navList.innerHTML = ''

    categoryList.forEach(category => {
        const navItem = document.createElement('li')
        navItem.innerText = category.categoryName
        navItem.onclick = function () {
            document.getElementById(category.categoryId).scrollIntoView({behavior: "smooth"})
            showOrHideNav()
        }
        navItem.setAttribute('class', 'navItem')
        navList.appendChild(navItem)
    })
}

function populateGallery() {
    categoryList.forEach(category => {
        const categoryDiv = document.createElement('div')
        categoryDiv.id = category.categoryId

        const nameIdCard = document.createElement('h2')
        nameIdCard.innerText = category.categoryName

        categoryDiv.appendChild(nameIdCard)

        category['images'].forEach(image => {
            const imgNode = document.createElement('img')

            imgNode.setAttribute('id', image.imageId)
            imgNode.src = `static/${image.src}`
            imgNode.setAttribute('class', "galleryItem")
            imgNode.addEventListener('click', showImg)

            categoryDiv.appendChild(imgNode)
        })
        gallery.insertBefore(categoryDiv, modal)
    })
}

function populateModalNav() {
    const imagesArr = getSelectedImageList()
    const dotDiv = document.querySelector('#dotModalNav')
    dotDiv.innerHTML = ""
    showOrHideSlideButtons("none")

    if (imagesArr.length == 1) return
    imagesArr.forEach(imageObj => {
        showOrHideSlideButtons("inline")
        const dotNode = document.createElement('span')
        dotNode.id = imageObj.imageId
        dotNode.addEventListener('click', showImg)
        dotNode.className = "dot"
        if (dotNode.id == currentImgId) {
            dotNode.className += " active"
        }
        dotDiv.appendChild(dotNode)
    })
}

function showOrHideNav() {
    if (sidebar.style.width == sidebarWidth) {
        sidebar.style.width = 0;
    } else {
        sidebar.style.width = sidebarWidth;

        populateSideNav();
    }
}

function clickOutsideSidebar(event) {
    if (sidebar.style.width == sidebarWidth && !sidebar.contains(event.target) && gallery.contains(event.target)) {
        showOrHideNav()
    }
}

function showImg(event) {
    const img = document.querySelector(`img#${event.currentTarget.id}`)
    modal.style.display = "block";
    modalImage.src = img.src;
    currentImgId = img.id

    populateModalNav()
}

function closeImage() {
    modal.style.display = "none"
    modalImage.removeAttribute('src')
    currentImgId = null
}

function moveSlide(event) {
    const n = event.currentTarget.moveN
    const imagesArr = getSelectedImageList()
    const imagesCount = imagesArr.length
    let idx = imagesArr.findIndex(el => el.imageId == currentImgId)
    idx = (idx + n) % imagesCount
    idx = idx < 0 ? imagesCount-1 : idx

    event.currentTarget.id = imagesArr[idx].imageId
    showImg(event)
    event.currentTarget.removeAttribute('id')
}

function getSelectedImageList() {
    return categoryList.find(cat =>
        cat.categoryId == document.getElementById(currentImgId).parentElement.id
    ).images
}

function showOrHideSlideButtons(display) {
    document.querySelector('.prev').style.display = display;
    document.querySelector('.next').style.display = display;
}

document.querySelectorAll('.navLogo img').forEach(l => l.addEventListener('click', showOrHideNav))
document.querySelector('.close').addEventListener('click', closeImage)
document.querySelector('.prev').addEventListener('click', moveSlide)
document.querySelector('.next').addEventListener('click', moveSlide)
document.addEventListener('click', clickOutsideSidebar)

populateGallery()
