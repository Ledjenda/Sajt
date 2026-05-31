const defaultProducts = [
  { id: 1, name: "Poludisperzija bela 15L", category: "Boje", price: 3890, manufacturer: "DIM Color", colorName: "Bela", packageSize: "15L", base: "Vodena", purpose: "Zidovi", description: "Bela unutrasnja boja za zidove i plafone.", color: "linear-gradient(135deg, #f8f8f2, #dfe7ea)" },
  { id: 2, name: "Akrilna fasadna boja 25kg", category: "Fasade", price: 6490, manufacturer: "Fasadex", colorName: "Bela", packageSize: "25kg", base: "Vodena", purpose: "Fasada", description: "Otporna akrilna boja za spoljne zidove.", color: "linear-gradient(135deg, #f2bf3a, #fff2b0)" },
  { id: 3, name: "Auto lak set 1L", category: "Auto program", price: 2850, manufacturer: "AutoPro", colorName: "Plava", packageSize: "1L", base: "Nitro", purpose: "Metal", description: "Set za zavrsno lakiranje automobilskih povrsina.", color: "linear-gradient(135deg, #2867a8, #8ec7f0)" },
  { id: 4, name: "Valjak profesionalni 25cm", category: "Alat", price: 740, manufacturer: "Master Tool", colorName: "Zelena", packageSize: "25cm", base: "Nije primenljivo", purpose: "Zidovi", description: "Profesionalni valjak za brzo i ravnomerno nanosenje.", color: "linear-gradient(135deg, #2f7d54, #a8d4b9)" },
  { id: 5, name: "Podloga za zidove 10L", category: "Boje", price: 2190, manufacturer: "DIM Color", colorName: "Providna", packageSize: "10L", base: "Vodena", purpose: "Zidovi", description: "Podloga za pripremu unutrasnjih zidova pre bojenja.", color: "linear-gradient(135deg, #d7dde2, #ffffff)" },
  { id: 6, name: "Lepak za stiropor 25kg", category: "Fasade", price: 980, manufacturer: "Fasadex", colorName: "Siva", packageSize: "25kg", base: "Nije primenljivo", purpose: "Fasada", description: "Lepak za stiropor i fasadne izolacione sisteme.", color: "linear-gradient(135deg, #b7b0a5, #f0ece4)" },
  { id: 7, name: "Smirgla P120 pakovanje", category: "Auto program", price: 520, manufacturer: "AutoPro", colorName: "Braon", packageSize: "10 kom", base: "Nije primenljivo", purpose: "Metal", description: "Brusni papir za pripremu povrsina.", color: "linear-gradient(135deg, #873f2c, #d99d6c)" },
  { id: 8, name: "Cetka ravna premium", category: "Alat", price: 460, manufacturer: "Master Tool", colorName: "Crna", packageSize: "70mm", base: "Nije primenljivo", purpose: "Drvo i metal", description: "Ravna cetka za precizno nanosenje boje i laka.", color: "linear-gradient(135deg, #182026, #f2bf3a)" }
];

const defaultAccounts = {
  firmaA: { password: "1234", type: "wholesale", label: "Firma A", phone: "+381 60 111 222", email: "firmaa@example.com", credit: 350000, baseDiscount: 15, categoryDiscounts: { Boje: 20, Fasade: 18, "Auto program": 12, Alat: 10 }, specialPrices: {}, history: [], invoices: [{ number: "FA-2026-014", amount: 42800, status: "U obradi" }, { number: "FA-2026-009", amount: 18600, status: "Dostavljeno" }], requests: [], permissions: { prices: true, requests: true } },
  firmaB: { password: "1234", type: "wholesale", label: "Firma B", phone: "+381 60 333 444", email: "firmab@example.com", credit: 180000, baseDiscount: 8, categoryDiscounts: { Boje: 12, Fasade: 25, "Auto program": 15, Alat: 8 }, specialPrices: {}, history: [], invoices: [{ number: "FB-2026-021", amount: 76500, status: "Ceka uplatu" }], requests: [], permissions: { prices: true, requests: true } },
  admin: { password: "admin", type: "admin", label: "Admin", baseDiscount: 0, categoryDiscounts: {}, specialPrices: {}, history: [] }
};

let products = JSON.parse(localStorage.getItem("dimteamProducts")) || defaultProducts;
const accounts = JSON.parse(localStorage.getItem("dimteamAccounts")) || defaultAccounts;
let currentKey = localStorage.getItem("dimteamCurrentAccount");
let currentAccount = currentKey ? accounts[currentKey] : null;
let cart = JSON.parse(localStorage.getItem("dimteamCart")) || [];
let filters = {};

products = products.map((product) => ({
  manufacturer: "Nije uneto", colorName: "Nije uneto", packageSize: "Nije uneto", base: "Nije primenljivo",
  purpose: "Nije uneto", description: "Opis proizvoda jos nije dodat.", image: "", inStock: true, ...product
}));
Object.values(accounts).forEach((account) => {
  account.specialPrices ||= {};
  account.history ||= [];
  account.invoices ||= [];
  account.requests ||= [];
  account.permissions ||= { prices: true, requests: true };
  account.credit ??= 0;
  account.phone ||= "";
  account.email ||= "";
});

function money(value) {
  return `${Math.round(value).toLocaleString("sr-RS")} RSD`;
}

function save() {
  localStorage.setItem("dimteamProducts", JSON.stringify(products));
  localStorage.setItem("dimteamAccounts", JSON.stringify(accounts));
  localStorage.setItem("dimteamCart", JSON.stringify(cart));
  if (currentKey) localStorage.setItem("dimteamCurrentAccount", currentKey);
  else localStorage.removeItem("dimteamCurrentAccount");
}

function discountFor(product) {
  if (!currentAccount || currentAccount.type !== "wholesale") return 0;
  return Math.max(currentAccount.baseDiscount || 0, currentAccount.categoryDiscounts[product.category] || 0);
}

function priceFor(product, account = currentAccount) {
  if (!account || account.type !== "wholesale") return product.price;
  if (account.specialPrices[product.id] !== undefined && account.specialPrices[product.id] !== "") return Number(account.specialPrices[product.id]);
  const discount = Math.max(account.baseDiscount || 0, account.categoryDiscounts[product.category] || 0);
  return product.price * (1 - discount / 100);
}

function recordView(product) {
  if (!currentAccount || currentAccount.type !== "wholesale") return;
  currentAccount.history = [product.name, ...currentAccount.history.filter((name) => name !== product.name)].slice(0, 20);
  save();
}

function renderHeader() {
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  });
  document.querySelectorAll("[data-welcome]").forEach((node) => {
    node.hidden = !currentAccount;
    node.innerHTML = currentAccount ? `Dobrodosli, <strong>${currentAccount.label}</strong>` : "";
  });
  document.querySelectorAll("[data-profile-menu]").forEach((menu) => {
    menu.hidden = !currentAccount;
    if (!currentAccount) return;
    menu.querySelector("[data-profile-initial]").textContent = currentAccount.label.charAt(0).toUpperCase();
    const links = currentAccount.type === "admin"
      ? `<a href="admin.html">Admin panel</a><a href="proizvodi.html">Pregled proizvoda</a><button type="button" data-logout>Odjavi se</button>`
      : `<a href="moj-nalog.html">Moj nalog</a>${currentAccount.permissions.prices ? '<a href="moje-cene.html">Moje veleprodajne cene</a>' : ""}${currentAccount.permissions.requests ? '<a href="specijalni-zahtevi.html">Specijalni zahtevi</a>' : ""}<a href="opcije.html">Opcije</a><button type="button" data-logout>Odjavi se</button>`;
    menu.querySelector("[data-profile-links]").innerHTML = links;
  });
}

function productImage(product) {
  return product.image
    ? `<img src="${product.image}" alt="${product.name}" />`
    : `<div class="product-swatch" style="--swatch: ${product.color}"></div>`;
}

function populateFilters() {
  document.querySelectorAll("[data-filter]").forEach((select) => {
    const key = select.dataset.filter;
    const first = select.options[0].outerHTML;
    const values = [...new Set(products.map((product) => product[key]).filter(Boolean))].sort();
    select.innerHTML = first + values.map((value) => `<option>${value}</option>`).join("");
    select.value = filters[key] || "";
  });
}

function filteredProducts() {
  let visible = products.filter((product) => Object.entries(filters).every(([key, value]) => !value || product[key] === value));
  const sort = document.querySelector("#sortProducts")?.value;
  if (sort === "price-asc") visible.sort((a, b) => priceFor(a) - priceFor(b));
  if (sort === "price-desc") visible.sort((a, b) => priceFor(b) - priceFor(a));
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  return visible;
}

function renderProducts() {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;
  const visible = filteredProducts();
  document.querySelector("#productCount").textContent = `${visible.length} proizvoda`;
  const view = grid.dataset.catalogView || "grid";
  grid.className = `product-grid view-${view}`;
  grid.innerHTML = visible.map((product) => {
    const discount = discountFor(product);
    const special = currentAccount?.type === "wholesale" && currentAccount.specialPrices[product.id] !== undefined && currentAccount.specialPrices[product.id] !== "";
    return `<article class="product-card" data-product="${product.id}">
      ${productImage(product)}
      <div class="product-body"><div class="product-meta">${product.category} | ${product.manufacturer}</div><h3>${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-meta">${product.packageSize} | ${product.base} | ${product.purpose}</div>
      <div class="price-row"><div>${discount || special ? `<div class="old-price">${money(product.price)}</div>` : ""}<div class="price">${money(priceFor(product))}</div></div>${special ? "<strong>Posebna cena</strong>" : discount ? `<strong>-${discount}%</strong>` : ""}</div>
      <button class="primary full" data-add="${product.id}">Dodaj u korpu</button></div>
    </article>`;
  }).join("");
}

function renderCart() {
  const items = document.querySelector("#cartItems");
  if (!items) return;
  cart = cart.filter((item) => products.some((product) => product.id === item.id));
  save();
  items.innerHTML = cart.length ? cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `<div class="cart-line"><div><strong>${product.name}</strong><div class="product-meta">${money(priceFor(product))}</div></div><div class="quantity-control"><button data-cart-minus="${item.id}">-</button><span>${item.qty}</span><button data-cart-plus="${item.id}">+</button><button class="remove-cart" data-cart-remove="${item.id}">Obrisi</button></div></div>`;
  }).join("") : "<p>Korpa je prazna.</p>";
  document.querySelector("#cartTotal").textContent = money(cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + priceFor(product) * item.qty;
  }, 0));
}

function renderAccountOverview() {
  const target = document.querySelector("#accountOverview");
  if (!target) return;
  if (currentAccount?.type !== "wholesale") { target.innerHTML = '<div class="panel"><p>Prijavite se kao veleprodajni kupac.</p><a class="primary" href="veleprodaja.html">Prijava</a></div>'; return; }
  target.innerHTML = `<div class="account-summary"><div class="panel"><h3>${currentAccount.label}</h3><p><strong>Korisnicko ime:</strong> ${currentKey}</p><p><strong>Telefon:</strong> ${currentAccount.phone || "-"}</p><p><strong>Email:</strong> ${currentAccount.email || "-"}</p></div><div class="credit-card"><span>Raspolozivi kredit</span><strong>${money(currentAccount.credit)}</strong></div></div><div class="panel"><h3>Fakture</h3><div class="invoice-table">${currentAccount.invoices.length ? currentAccount.invoices.map((invoice) => `<div class="invoice-row"><strong>${invoice.number}</strong><span>${money(invoice.amount)}</span><em>${invoice.status}</em></div>`).join("") : "<p>Jos nema faktura.</p>"}</div></div>`;
}

function renderWholesalePricesPage() {
  const target = document.querySelector("#wholesalePricesPage");
  if (!target) return;
  if (currentAccount?.type !== "wholesale" || !currentAccount.permissions.prices) { target.innerHTML = '<div class="panel"><p>Nemate dozvolu za pregled veleprodajnih cena.</p></div>'; return; }
  target.innerHTML = `<div class="panel price-page-table"><div class="price-page-row price-page-head"><strong>Proizvod</strong><strong>Cena</strong><strong>Stanje</strong></div>${products.map((product) => `<div class="price-page-row"><span>${product.name}</span><strong>${money(priceFor(product))}</strong><span class="stock ${product.inStock ? "in" : "out"}">${product.inStock ? "Ima na stanju" : "Nema na stanju"}</span></div>`).join("")}</div>`;
}

function renderRequests() {
  const target = document.querySelector("#requestList");
  if (!target) return;
  target.innerHTML = currentAccount?.requests?.length ? currentAccount.requests.map((request) => `<div class="request-row"><strong>${request.date}</strong><p>${request.text}</p><span>${request.status}</span></div>`).join("") : "<p>Jos nema poslatih zahteva.</p>";
}

function renderRules() {
  const rules = document.querySelector("#customerRules");
  if (!rules) return;
  rules.innerHTML = Object.entries(accounts).filter(([, account]) => account.type === "wholesale").map(([key, account]) =>
    `<div class="rule-card"><strong>${account.label} (${key})</strong><span>Opsti rabat: ${account.baseDiscount}%</span><span>Boje ${account.categoryDiscounts.Boje || 0}% | Fasade ${account.categoryDiscounts.Fasade || 0}% | Auto ${account.categoryDiscounts["Auto program"] || 0}% | Alat ${account.categoryDiscounts.Alat || 0}%</span></div>`
  ).join("");
}

function renderAdminProducts() {
  const list = document.querySelector("#adminProductList");
  if (!list) return;
  list.innerHTML = products.map((product) => `<div class="admin-product-row"><div><strong>${product.name}</strong><span>${product.category} | ${money(product.price)}</span></div><div class="row-actions"><button class="secondary small" type="button" data-edit-product="${product.id}">Izmeni</button><button class="danger small" type="button" data-delete-product="${product.id}">Obrisi</button></div></div>`).join("");
}

function renderAdminCustomers() {
  const list = document.querySelector("#adminCustomerList");
  if (!list) return;
  list.innerHTML = Object.entries(accounts).filter(([, account]) => account.type === "wholesale").map(([key, account]) =>
    `<button class="customer-button" type="button" data-customer-details="${key}"><strong>${account.label}</strong><span>${key}</span></button>`
  ).join("");
}

function renderAccountList() {
  const list = document.querySelector("#accountList");
  if (!list) return;
  list.innerHTML = Object.entries(accounts).filter(([, account]) => account.type === "wholesale").map(([key, account]) => `<div class="admin-product-row"><div><strong>${account.label}</strong><span>${key} | ${account.permissions.prices ? "Cene" : "Bez cena"} | ${account.permissions.requests ? "Zahtevi" : "Bez zahteva"}</span></div></div>`).join("");
}

function renderCustomerDetails(key) {
  const target = document.querySelector("#customerDetails");
  const account = accounts[key];
  if (!target || !account) return;
  target.innerHTML = `<h3>${account.label}</h3><p><strong>Istorija gledanja:</strong> ${account.history.length ? account.history.join(", ") : "Jos nema pregledanih proizvoda."}</p><h3>Dozvole</h3><label><input type="checkbox" data-existing-permission="prices" ${account.permissions.prices ? "checked" : ""} /> Moze da vidi veleprodajne cene</label><label><input type="checkbox" data-existing-permission="requests" ${account.permissions.requests ? "checked" : ""} /> Moze da salje specijalne zahteve</label><button class="secondary full" type="button" data-save-permissions="${key}">Sacuvaj dozvole</button><h3>Specijalni zahtevi</h3>${account.requests.length ? account.requests.map((request) => `<div class="request-row"><strong>${request.date}</strong><p>${request.text}</p><span>${request.status}</span></div>`).join("") : "<p>Nema zahteva.</p>"}<h3>Posebne cene</h3><p class="form-message">Ostavite polje prazno da bi se koristio rabat kupca.</p>${products.map((product) => `<label>${product.name}<input type="number" min="0" placeholder="${money(priceFor(product, account))}" data-special-price="${product.id}" value="${account.specialPrices[product.id] ?? ""}" /></label>`).join("")}<button class="primary full" type="button" data-save-special-prices="${key}">Sacuvaj posebne cene</button>`;
}

function renderAll() {
  renderHeader();
  populateFilters();
  renderProducts();
  renderCart();
  renderRules();
  renderAdminProducts();
  renderAdminCustomers();
  renderAccountList();
  renderAccountOverview();
  renderWholesalePricesPage();
  renderRequests();
}

document.addEventListener("click", (event) => {
  const logout = event.target.closest("[data-logout]");
  if (logout) {
    currentKey = null; currentAccount = null; save(); renderAll();
    if (location.pathname.endsWith("admin.html")) location.href = "index.html";
  }
});

document.querySelectorAll("[data-filter]").forEach((select) => select.addEventListener("change", () => {
  filters[select.dataset.filter] = select.value; renderProducts();
}));
document.querySelector("#sortProducts")?.addEventListener("change", renderProducts);
document.querySelector(".view-switch")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]"); if (!button) return;
  document.querySelectorAll("[data-view]").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  document.querySelector("#productGrid").dataset.catalogView = button.dataset.view;
  renderProducts();
});
document.querySelector("#clearFilters")?.addEventListener("click", () => { filters = {}; populateFilters(); renderProducts(); });

document.querySelector("#productGrid")?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-product]");
  if (card) recordView(products.find((item) => item.id === Number(card.dataset.product)));
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = Number(button.dataset.add);
  const product = products.find((item) => item.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += 1; else cart.push({ id, qty: 1 });
  save(); renderHeader(); renderCart();
});

document.querySelector("#cartItems")?.addEventListener("click", (event) => {
  const plus = event.target.closest("[data-cart-plus]");
  const minus = event.target.closest("[data-cart-minus]");
  const remove = event.target.closest("[data-cart-remove]");
  const id = Number((plus || minus || remove)?.dataset.cartPlus || (minus || remove)?.dataset.cartMinus || remove?.dataset.cartRemove);
  if (!id) return;
  const item = cart.find((entry) => entry.id === id);
  if (plus) item.qty += 1;
  if (minus) item.qty -= 1;
  if (remove || item.qty <= 0) cart = cart.filter((entry) => entry.id !== id);
  save(); renderHeader(); renderCart();
});

document.querySelector("#loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.querySelector("#username").value.trim();
  const account = accounts[username];
  const message = document.querySelector("#loginMessage");
  if (!account || account.password !== document.querySelector("#password").value) {
    message.textContent = "Pogresno korisnicko ime ili sifra."; return;
  }
  currentKey = username; currentAccount = account; save();
  if (account.type === "admin") location.href = "admin.html";
  else location.href = "proizvodi.html";
});
document.querySelector("#logoutButton")?.addEventListener("click", () => { currentKey = null; currentAccount = null; save(); renderAll(); });

const customerSelect = document.querySelector("#customerSelect");
const categorySelect = document.querySelector("#categorySelect");
function updateAdminFields() {
  if (!customerSelect || !categorySelect) return;
  document.querySelector("#baseDiscount").value = accounts[customerSelect.value].baseDiscount;
  document.querySelector("#categoryDiscount").value = accounts[customerSelect.value].categoryDiscounts[categorySelect.value] || 0;
}
customerSelect?.addEventListener("change", updateAdminFields);
categorySelect?.addEventListener("change", updateAdminFields);
document.querySelector("#discountForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#adminMessage");
  if (currentAccount?.type !== "admin") { message.textContent = "Prvo se prijavite kao admin."; return; }
  const account = accounts[customerSelect.value];
  account.baseDiscount = Number(document.querySelector("#baseDiscount").value);
  account.categoryDiscounts[categorySelect.value] = Number(document.querySelector("#categoryDiscount").value);
  save(); renderRules(); message.textContent = "Pravila su sacuvana.";
});

function resetProductForm() {
  document.querySelector("#productForm")?.reset();
  if (!document.querySelector("#productId")) return;
  document.querySelector("#productId").value = "";
  document.querySelector("#productFormTitle").textContent = "Dodaj proizvod";
}
document.querySelector("#productForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#productMessage");
  if (currentAccount?.type !== "admin") { message.textContent = "Prvo se prijavite kao admin."; return; }
  const id = Number(document.querySelector("#productId").value);
  const old = products.find((product) => product.id === id);
  const file = document.querySelector("#productImage").files[0];
  const applyProduct = (image) => {
    const values = { name: document.querySelector("#productName").value.trim(), category: document.querySelector("#productCategory").value, price: Number(document.querySelector("#productPrice").value), description: document.querySelector("#productDescription").value.trim(), manufacturer: document.querySelector("#productManufacturer").value.trim(), colorName: document.querySelector("#productColorName").value.trim(), packageSize: document.querySelector("#productPackageSize").value.trim(), base: document.querySelector("#productBase").value, purpose: document.querySelector("#productPurpose").value.trim(), image: image || old?.image || "", color: old?.color || "linear-gradient(135deg, #d7dde2, #ffffff)" };
    if (id) Object.assign(old, values); else products.push({ id: Date.now(), ...values });
    save(); resetProductForm(); renderAdminProducts(); message.textContent = id ? "Proizvod je izmenjen." : "Proizvod je dodat.";
  };
  if (file) { const reader = new FileReader(); reader.onload = () => applyProduct(reader.result); reader.readAsDataURL(file); } else applyProduct("");
});
document.querySelector("#adminProductList")?.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit-product]");
  const remove = event.target.closest("[data-delete-product]");
  if (currentAccount?.type !== "admin") return;
  if (edit) {
    const product = products.find((item) => item.id === Number(edit.dataset.editProduct));
    [["productId", product.id], ["productName", product.name], ["productCategory", product.category], ["productPrice", product.price], ["productDescription", product.description], ["productManufacturer", product.manufacturer], ["productColorName", product.colorName], ["productPackageSize", product.packageSize], ["productBase", product.base], ["productPurpose", product.purpose]].forEach(([id, value]) => document.querySelector(`#${id}`).value = value);
    document.querySelector("#productFormTitle").textContent = "Izmeni proizvod";
  }
  if (remove) { products = products.filter((item) => item.id !== Number(remove.dataset.deleteProduct)); save(); renderAdminProducts(); }
});
document.querySelector("#cancelProductEdit")?.addEventListener("click", resetProductForm);
document.querySelector("#adminCustomerList")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-customer-details]"); if (button) renderCustomerDetails(button.dataset.customerDetails);
});
document.querySelector("#customerDetails")?.addEventListener("click", (event) => {
  if (currentAccount?.type !== "admin") return;
  const pricesButton = event.target.closest("[data-save-special-prices]");
  const permissionsButton = event.target.closest("[data-save-permissions]");
  if (pricesButton) {
    const account = accounts[pricesButton.dataset.saveSpecialPrices];
    document.querySelectorAll("[data-special-price]").forEach((input) => { if (input.value === "") delete account.specialPrices[input.dataset.specialPrice]; else account.specialPrices[input.dataset.specialPrice] = Number(input.value); });
    save(); renderCustomerDetails(pricesButton.dataset.saveSpecialPrices);
  }
  if (permissionsButton) {
    const account = accounts[permissionsButton.dataset.savePermissions];
    document.querySelectorAll("[data-existing-permission]").forEach((input) => account.permissions[input.dataset.existingPermission] = input.checked);
    save(); renderCustomerDetails(permissionsButton.dataset.savePermissions); renderAccountList();
  }
});

document.querySelector("#requestForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentAccount?.type !== "wholesale" || !currentAccount.permissions.requests) return;
  currentAccount.requests.unshift({ date: new Date().toLocaleDateString("sr-RS"), text: document.querySelector("#requestText").value.trim(), status: "Poslato adminu" });
  save(); event.target.reset(); document.querySelector("#requestMessage").textContent = "Zahtev je poslat."; renderRequests();
});

if (document.querySelector("#profileForm") && currentAccount?.type === "wholesale") {
  document.querySelector("#profileLabel").value = currentAccount.label;
  document.querySelector("#profileUsername").value = currentKey;
  document.querySelector("#profilePhone").value = currentAccount.phone;
  document.querySelector("#profileEmail").value = currentAccount.email;
}
document.querySelector("#profileForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentAccount?.type !== "wholesale") return;
  const newUsername = document.querySelector("#profileUsername").value.trim();
  if (newUsername !== currentKey && accounts[newUsername]) { document.querySelector("#profileMessage").textContent = "Korisnicko ime vec postoji."; return; }
  currentAccount.label = document.querySelector("#profileLabel").value.trim();
  currentAccount.phone = document.querySelector("#profilePhone").value.trim();
  currentAccount.email = document.querySelector("#profileEmail").value.trim();
  if (document.querySelector("#profilePassword").value) currentAccount.password = document.querySelector("#profilePassword").value;
  if (newUsername !== currentKey) { accounts[newUsername] = currentAccount; delete accounts[currentKey]; currentKey = newUsername; }
  save(); renderHeader(); document.querySelector("#profileMessage").textContent = "Podaci su sacuvani.";
});

document.querySelector("#accountForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#accountMessage");
  if (currentAccount?.type !== "admin") { message.textContent = "Prvo se prijavite kao admin."; return; }
  const username = document.querySelector("#newUsername").value.trim();
  if (accounts[username]) { message.textContent = "Korisnicko ime vec postoji."; return; }
  accounts[username] = { password: document.querySelector("#newPassword").value, type: "wholesale", label: document.querySelector("#newAccountLabel").value.trim(), phone: document.querySelector("#newPhone").value.trim(), email: document.querySelector("#newEmail").value.trim(), credit: Number(document.querySelector("#newCredit").value), baseDiscount: 0, categoryDiscounts: {}, specialPrices: {}, history: [], invoices: [], requests: [], permissions: { prices: document.querySelector("#permissionPrices").checked, requests: document.querySelector("#permissionRequests").checked } };
  save(); event.target.reset(); renderAdminCustomers(); renderAccountList(); message.textContent = "Nalog je napravljen.";
});

const cartDrawer = document.querySelector("#cartDrawer");
const overlay = document.querySelector("#overlay");
function closeDrawers() { cartDrawer?.classList.remove("open"); overlay?.classList.remove("open"); }
document.querySelector("#cartButton")?.addEventListener("click", () => { cartDrawer.classList.add("open"); overlay.classList.add("open"); });
document.querySelector("#closeCart")?.addEventListener("click", closeDrawers);
overlay?.addEventListener("click", closeDrawers);

function closeHeaderMenus(except) {
  document.querySelectorAll(".site-menu, .profile-menu").forEach((menu) => {
    if (menu !== except) menu.open = false;
  });
  document.querySelectorAll("[data-search-panel]").forEach((panel) => { panel.hidden = true; });
}
document.addEventListener("click", (event) => {
  const summary = event.target.closest(".site-menu summary, .profile-menu summary");
  if (summary) { closeHeaderMenus(summary.closest("details")); return; }
  if (event.target.closest("[data-search-open]")) {
    document.querySelectorAll(".site-menu, .profile-menu").forEach((menu) => { menu.open = false; });
    return;
  }
  if (event.target.closest(".site-menu nav a, .profile-menu nav a, .profile-menu nav button")) {
    closeHeaderMenus(); return;
  }
  if (!event.target.closest(".site-menu, .profile-menu, [data-header-search]")) closeHeaderMenus();
});

document.querySelectorAll("[data-search-open]").forEach((button) => button.addEventListener("click", () => {
  const panel = button.closest("[data-header-search]").querySelector("[data-search-panel]");
  panel.hidden = !panel.hidden;
  if (!panel.hidden) panel.querySelector("[data-search-input]").focus();
}));
document.querySelectorAll("[data-search-input]").forEach((input) => input.addEventListener("input", () => {
  const query = input.value.trim().toLocaleLowerCase("sr");
  const results = input.closest("[data-header-search]").querySelector("[data-search-results]");
  const score = (name) => {
    const normalized = name.toLocaleLowerCase("sr");
    if (normalized === query) return 100;
    if (normalized.startsWith(query)) return 80;
    if (normalized.includes(query)) return 60;
    return query.split(/\s+/).filter((word) => normalized.includes(word)).length * 10;
  };
  const matches = query ? products.map((product) => ({ product, score: score(product.name) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 10).map((item) => item.product) : [];
  results.innerHTML = matches.length ? matches.map((product) => `<a class="search-result" href="proizvodi.html"><strong>${product.name}</strong><span>${product.category} | ${money(priceFor(product))}</span></a>`).join("") : query ? "<p>Nema rezultata.</p>" : "";
}));

if (customerSelect) updateAdminFields();
if (document.querySelector("#adminLock") && currentAccount?.type === "admin") document.querySelector("#adminLock").textContent = "Admin panel je aktivan.";
renderAll();
if (location.hash === "#cart") { cartDrawer?.classList.add("open"); overlay?.classList.add("open"); }
