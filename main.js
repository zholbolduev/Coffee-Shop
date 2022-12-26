const API = " http://localhost:8000/products"

// инпуты для создание новых продуктов
const inpDetails = document.getElementsByClassName('details-input')[0]
const inpPrice = document.getElementsByClassName('price-input')[0]
const inpQuantity = document.getElementsByClassName('quantity-input')[0]
const inpSales = document.getElementsByClassName('sales-input')[0]
const inpCategory = document.getElementsByClassName('category-input')[0]
const inpUrl = document.getElementsByClassName('url-input')[0]
const btnAdd = document.getElementsByClassName('btn-add')[0]
const accordion = document.getElementsByClassName('accordion__header')[0]
const accordionBody = document.getElementById('accordion__body')


// для отображение
const sectionRead = document.getElementById("section__read")

// селекторы для редактирование
const inpEditDetails = document.getElementsByClassName('window__edit_details')[0]
const inpEditPrice = document.getElementsByClassName('window__edit_price')[0]
const inpEditQuantity = document.getElementsByClassName('window__edit_quantity')[0]
const inpEditSales = document.getElementsByClassName('window__edit_sales')[0]
const inpEditCategory = document.getElementsByClassName('window__edit_category')[0]
const inpEditUrl = document.getElementsByClassName('window__edit_url')[0]
const btnSave = document.getElementsByClassName('window__edit_btn-save')[0]
const btnCloseModal = document.getElementsByClassName('window__edit_close')[0]
const mainModal = document.getElementsByClassName('main-modal')[0]

// инпут для переменная для поиска
const inpSearch = document.getElementsByClassName('search-txt')[0]
let searchValue = inpSearch.value


// filter
const form = document.getElementsByTagName('form')[0];
let category = 'all'

// pagination
const prevBtn = document.getElementsByClassName('prev-btn')[0];
const nextBtn = document.getElementsByClassName('next-btn')[0];
const limit = 4;
let currentPage = 1;

// селектор админа
const sectionAdd = document.getElementsByClassName('section__add')[0]
const openAdmin = document.getElementById('open-admin')
const adminPanels = document.getElementsByClassName('admin-panel')

//!================================ADMIN START========================================
let password = ''
function checkAdmin() {
    if(password === '123'){
        for(let i of adminPanels) {
            i.style.display = 'block'
        }
        sectionAdd.style.display = 'block'
    }else{
        for(let i of adminPanels) {
            i.style.display = 'none'
        }
        sectionAdd.style.display = 'none'
    }
}
openAdmin.addEventListener("click", function () {
    password = prompt('ввeдитe пароль')
    checkAdmin()
})
// ?=============================ADMIN END==================================================

// !========================ACCORDION START========================================================
accordion.addEventListener('click', function() {

    accordion.classList.toggle("active")
    if(accordion.classList.contains('active')) {
        accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px'
    }else{
        accordionBody.style.maxHeight = 0
    }
//? =================================ACCORDION END=========================================

//!=============================CREATE START======================================
})
async function createProduct(newProduct) {
    const options = {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    }
    await fetch(API, options)
    render()
}

btnAdd.addEventListener('click', function () {
    if(!inpDetails.value.trim() ||
    !inpPrice.value.trim() ||
    !inpQuantity.value.trim() ||
    !inpSales.value.trim() ||
    !inpCategory.value.trim() ||
    !inpUrl.value.trim() 
    ){
        alert('заполните поля')
        return
    } 
    const newProduct = {
        details: inpDetails.value,
        price: inpPrice.value,
        quantity: inpQuantity.value,
        category: inpCategory.value,
        sale: inpSales.value,
        urlImg: inpUrl.value,
        liked: false
    }
    createProduct(newProduct)
    inpDetails.value = ""
    inpPrice.value = ""
    inpQuantity.value = ""
    inpCategory.value = ""
    inpSales.value = ""
    inpUrl.value = ""
})
//?==================================CREATE END====================================

//!==========GET PRODUCT START====================================
async function getProducts(){
    const response = await fetch(`${API}?q=${searchValue}&_limit=${limit}&_page=${currentPage}&${category === 'all' ? "" : 'category=' + category}`)
    const result = await response.json() 
    return result
}

async function getProductById(id) {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();
    return result;
  }
//? ============GET PRODUCT END====================================

//!=============RENDER START==================================
async function render(){
    const data =  await getProducts()
    sectionRead.innerHTML = '';
    data.forEach(product => {
        sectionRead.innerHTML += `
        <div class="product">
        <div class="product__img-wrapper">
            <div class="product__img" style="background-image: url(${product.urlImg})"></div>
        <div class="product__title">
            <p>${product.details}</p>
        </div>
        </div>
        <div class="product__details">
            <h2>${product.category}</h2>
            <span>Цена: ${product.price} сом</span>
            <span>Скидка: ${product.sale} %</span>
        </div>
        <div>
        <span class="btn-like" onclick="toggleLike(${product.id})"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"> 
              <path fill="${product.liked ? '#f05542':'#000'}" d="M5.301 3.002c-.889-.047-1.759.247-2.404.893-1.29 1.292-1.175 3.49.26 4.926l.515.515L8.332 14l4.659-4.664.515-.515c1.435-1.437 1.55-3.634.26-4.926-1.29-1.292-3.483-1.175-4.918.262l-.516.517-.517-.517C7.098 3.438 6.19 3.049 5.3 3.002z"/> 
            </svg> 
          </span>
           <button class="btn-buy">Купить</button>
        </div>
        <div class="admin-panel" id="admin">
        <img 
        src="https://cdn-icons-png.flaticon.com/512/1799/1799391.png"
        
        alt=""
        width="30"
        onClick="deleteProduct(${product.id})"
        />
        <img 
        src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png"
      
        alt=""
        width="30"
        onClick="handleEdit(${product.id})"
        />
        </div>
            </div>`
    })
    checkTotalPages()
    checkAdmin()
}
// ?===========RENDER END===========================================

// !=============DELETE START=========================
async function deleteProduct(id) {
    await fetch(`${API}/${id}`, {method: "DELETE"})
render()
}
// ?==========DELETE END===========================

// !============EDIT START=========================
async function editProduct(id, editedProduct) {
    await fetch(`${API}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedProduct),
        headers: {
            'Content-Type':  'application/json'
        }
    })
    render()
}
let editId = ''

async function handleEdit(id) {
    mainModal.style.display = 'block'
const productToEdit = await getProductById(id)
inpEditDetails.value = productToEdit.details
inpEditQuantity.value = productToEdit.quantity
inpEditPrice.value = productToEdit.price
inpEditCategory.value = productToEdit.category
inpEditSales.value = productToEdit.sale
inpEditUrl.value = productToEdit.urlImg
editId = id
}


btnSave.addEventListener('click', () => {
    if(!inpEditDetails.value.trim() ||
    !inpEditPrice.value.trim() ||
    !inpEditQuantity.value.trim() ||
    !inpEditSales.value.trim() ||
    !inpEditCategory.value.trim() ||
    !inpEditUrl.value.trim() 
    ){
        alert('заполните поля')
        return
}

const editedProduct = {
    details: inpEditDetails.value,
    price: inpEditPrice.value,
    quantity: inpEditQuantity.value,
    category: inpEditCategory.value,
    sale: inpEditSales.value,
    urlImg: inpEditUrl.value
}
editProduct(editId, editedProduct)
mainModal.style.display = 'none'
})
// ?============EDIT END=====================


//!================SEARCH START===================
inpSearch.addEventListener('input', function(e){
    searchValue = e.target.value
    render()
})
// ?=============SEARCH END======================================

// !===============FILTER START========================
form.addEventListener('change', function(e) {
    category = e.target.value;
    render()
})
// ?===============FILTER END=========================

// !==============PAGINATION START===================
let countPage = 1;
async function checkTotalPages() {
    const response = await fetch(`${API}?q=${searchValue}`)
    const data = await response.json()
    countPage = Math.ceil(data.length / limit)
    console.log(data.length)
}
prevBtn.addEventListener('click', function(){
    if(currentPage <= 1) return
    currentPage--
    render()
})
nextBtn.addEventListener('click', function(){
    if(currentPage >= countPage) return
    currentPage++
    render()
})
// ?===============PAGINATION END========================

// !==========LIKE START=================\
async function toggleLike(id){
    const product = await getProductById(id)
    const changedProduct = {
        liked: !product.liked
    }
    editProduct(id, changedProduct)
}

// ?===========LIKE END=================

render()

