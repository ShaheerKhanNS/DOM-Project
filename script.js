let docTitle = document.title;
let url = `https://crudcrud.com/api/8b3e01eaca3c41afb24e1dbebd826aec`;

window.addEventListener("blur", () => {
  document.title = "Come back 😥";
});
window.addEventListener("focus", () => {
  document.title = docTitle;
});

const clearField = () => {
  document.getElementById("product").value =
    document.getElementById("price").value =
    document.getElementById("category").value =
      "";
};

const render = (id, product, price, category) => {
  let indianCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 3,
  });
  const formattedPrice = indianCurrency.format(price);
  const template = `<tr id=${id}>
                <td id="product_${id}">${product}</td>
                <td id="price_${id}">${formattedPrice}</td>
                <td id="category_${id}">${category}</td>
                <td>
                  <button
                  data-set ='${id}'
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    onclick="editEl(this)"
                  >
                    Edit
                  </button>
                  <button data-set ='${id}' type="button" class="btn btn-outline-danger btn-sm"
                  onclick="deleteEl(this)">
                    Delete
                  </button>
                </td>`;

  const entertainment = document.getElementById("entertainmentBody");
  const food = document.getElementById("foodBody");
  const mobilePhone = document.getElementById("phoneBody");

  if (category === "Entertainment") {
    entertainment.innerHTML += template;
  } else if (category === "Food") {
    food.innerHTML += template;
  } else {
    mobilePhone.innerHTML += template;
  }
};

const productBtn = document.getElementById("addbtn");

productBtn.addEventListener("click", async () => {
  try {
    const product = document.getElementById("product").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;

    if (product && price && category) {
      const data = await axios({
        method: "POST",
        url: `${url}/product`,
        data: {
          product,
          price,
          category,
        },
      });

      clearField();
      render(data.data._id, product, price, category);
    }
  } catch (err) {
    console.log(err.message);
  }
});

const deleteEl = async (el) => {
  try {
    const id = el.dataset.set;

    await axios({
      method: "DELETE",
      url: `${url}/product/${id}`,
    });

    el.closest("tr").remove();
  } catch (err) {
    console.log(err.message);
  }
};

const editEl = async (el) => {
  try {
    const id = el.dataset.set;

    const price = document.getElementById(`price_${id}`).textContent;
    const product = document.getElementById(`product_${id}`).textContent;
    const category = document.getElementById(`category_${id}`).textContent;
    document.getElementById("product").value = product;
    document.getElementById("price").value = price
      .replace("₹", "")
      .replace(",", "");
    document.getElementById("category").value = category;

    deleteEl(el);
  } catch (err) {
    console.log(err.message);
  }
};

const retriveData = async () => {
  try {
    const data = await axios({
      method: "GET",
      url: `${url}/product`,
    });

    data.data.forEach((el) => {
      render(el._id, el.product, el.price, el.category);
    });
  } catch (err) {
    console.log(err.message);
  }
};

window.addEventListener("DOMContentLoaded", retriveData);
