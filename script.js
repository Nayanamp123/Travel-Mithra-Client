const ADMIN_SESSION_KEY = "travelmithra_admin_logged_in";
const ADMIN_TOKEN_KEY = "travelmithra_admin_token";
const USER_SESSION_KEY = "travelmithra_user_logged_in";
const LOCAL_ADMIN_STORAGE_KEY = "travelmithra_registered_demo_admins";
const USER_STORAGE_KEY = "travelmithra_registered_users";
const BOOKING_STORAGE_KEY = "travelmithra_user_bookings";
const API_BASE_URL = "http://localhost:5000";

const demoAdmins = [
  { name: "Ratheesh", userId: "ratheesh123", email: "admin1@travelmithra.com", password: "Admin@123" },
  { name: "Travel Mithra Admin Two", userId: "admin_two", email: "admin2@travelmithra.com", password: "Admin@456" },
];

const sampleCustomers = [
  {
    id: "sample-1",
    receiptNo: "TMH/1906/08042026",
    date: "08/04/2026",
    name: "SMITHA",
    userId: "sample-smitha",
    address: "Padamugal, Kakkanadu, Cochin",
    destination: "KASHMIR 17 APR26",
    group: "3 ADULT",
    paymentMode: "BANK TRANSFER",
    acceptedBy: "SHARANYA RATHEESH",
    totalAmount: 138000,
    paidAmount: 72000,
    status: "confirmed",
    remarks: "",
  },
  {
    id: "sample-2",
    receiptNo: "TMH/1907/09042026",
    date: "09/04/2026",
    name: "ANJALI NAIR",
    userId: "sample-anjali",
    address: "Vyttila, Ernakulam",
    destination: "MUNNAR FAMILY PACKAGE",
    group: "2 ADULT, 1 CHILD",
    paymentMode: "UPI",
    acceptedBy: "ADMIN",
    totalAmount: 36000,
    paidAmount: 18000,
    status: "confirmed",
    remarks: "Hotel balance pending",
  },
  {
    id: "sample-3",
    receiptNo: "TMH/1908/10042026",
    date: "10/04/2026",
    name: "RAHUL MENON",
    userId: "sample-rahul",
    address: "Thrissur, Kerala",
    destination: "DUBAI TOUR",
    group: "4 ADULT",
    paymentMode: "CASH",
    acceptedBy: "ADMIN",
    totalAmount: 220000,
    paidAmount: 150000,
    status: "confirmed",
    remarks: "Passport copies received",
  },
];

const tourOptions = [
  { value: "Leh - Ladakh - Kargil", label: "Leh - Ladakh - Kargil - Rs.65,000", price: 65000 },
  { value: "Malaysia Package", label: "Malaysia Package - Rs.46,000", price: 46000 },
  { value: "Exciting Lakshadweep", label: "Exciting Lakshadweep - Rs.36,000", price: 36000 },
  { value: "Kashmir Holiday", label: "Kashmir Holiday - Rs.1,38,000", price: 138000 },
  { value: "Munnar Escape", label: "Munnar Escape - Rs.36,000", price: 36000 },
  { value: "Dubai Tour", label: "Dubai Tour - Rs.2,20,000", price: 220000 },
  { value: "Bali Vacation", label: "Bali Vacation - Rs.1,42,000", price: 142000 },
  { value: "Kerala Packages", label: "Kerala Packages - Rs.48,000", price: 48000 },
];

const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const customerHomeView = document.querySelector("#customerHomeView");
const userPortalView = document.querySelector("#userPortalView");
const closeLoginView = document.querySelector("#closeLoginView");
const headerSearchButton = document.querySelector("#headerSearchButton");
const accountMenuButton = document.querySelector("#accountMenuButton");
const accountMenu = document.querySelector("#accountMenu");
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const registerMessage = document.querySelector("#registerMessage");
const showRegister = document.querySelector("#showRegister");
const showLogin = document.querySelector("#showLogin");
const customerRows = document.querySelector("#customerRows");
const destinationFilter = document.querySelector("#destinationFilter");
const adminPasswordInput = document.querySelector("#adminPassword");
const togglePassword = document.querySelector("#togglePassword");
const passwordIcon = document.querySelector("#passwordIcon");
const userWelcome = document.querySelector("#userWelcome");
const userTripRows = document.querySelector("#userTripRows");
const tripPaymentForm = document.querySelector("#tripPaymentForm");
const tripDestination = document.querySelector("#tripDestination");
const paymentAmount = document.querySelector("#paymentAmount");
const paymentMessage = document.querySelector("#paymentMessage");
const homeTripDate = document.querySelector("#homeTripDate");
const homeDestination = document.querySelector("#homeDestination");
const homeGuests = document.querySelector("#homeGuests");
const filterButton = document.querySelector(".filter-button");
const tourFilterMenu = document.querySelector("#tourFilterMenu");
const searchSubmit = document.querySelector(".search-submit");
const bookCta = document.querySelector(".book-cta");
const tourCards = document.querySelectorAll(".tour-card");

const money = (value) => `Rs.${Number(value).toLocaleString("en-IN")}/-`;
const balance = (customer) => Number(customer.totalAmount) - Number(customer.paidAmount);

const getStored = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setStored = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const fillDestinationSelect = (select, includePlaceholder = true) => {
  select.innerHTML = [
    includePlaceholder ? '<option value="">Select destination</option>' : "",
    ...tourOptions.map((tour) => `<option value="${tour.value}" data-price="${tour.price}">${tour.label}</option>`),
  ].join("");
};

const apiPost = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

fillDestinationSelect(homeDestination);
fillDestinationSelect(tripDestination);

const setAuthMode = (mode) => {
  const isRegisterMode = mode === "register";

  registerForm.classList.toggle("hidden", !isRegisterMode);
  loginForm.classList.toggle("hidden", isRegisterMode);
  showRegister.classList.toggle("is-active", isRegisterMode);
  showLogin.classList.toggle("is-active", !isRegisterMode);
  loginError.textContent = "";
  registerMessage.textContent = "";
};

const setPendingTripSearch = () => {
  sessionStorage.setItem(
    "travelmithra_pending_trip_search",
    JSON.stringify({
      destination: homeDestination.value,
      date: homeTripDate.value,
      guests: homeGuests.value || "1",
    }),
  );
};

const applyPendingTripSearch = () => {
  const pending = JSON.parse(sessionStorage.getItem("travelmithra_pending_trip_search") || "{}");

  if (!pending.destination && !pending.date && !pending.guests) {
    return;
  }

  tripDestination.value = pending.destination || "";
  document.querySelector("#tripDate").value = pending.date || "";
  document.querySelector("#travellerCount").value = pending.guests || 1;

  const selectedOption = tripDestination.options[tripDestination.selectedIndex];
  if (selectedOption?.dataset.price) {
    paymentAmount.value = selectedOption.dataset.price;
  }
};

const openTripSelection = () => {
  const user = getLoggedUser();
  setPendingTripSearch();

  if (user) {
    showUserPortal();
    return;
  }

  showLoginScreen("login");
  loginError.textContent = "Please login or register to confirm your payment.";
};

const filterTours = (destination) => {
  const hasMatch = [...tourCards].some((card) => (card.querySelector("h3")?.textContent || "") === destination);

  tourCards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent || "";
    card.classList.toggle("is-filtered-out", destination !== "all" && hasMatch && title !== destination);
  });
};

const destinationNameMap = {
  Lakshadweep: "Exciting Lakshadweep",
  "Leh - Ladakh": "Leh - Ladakh - Kargil",
  Malaysia: "Malaysia Package",
};

const today = new Date().toISOString().split("T")[0];
homeTripDate.min = today;
document.querySelector("#tripDate").min = today;

const makeReceiptNo = () => {
  const date = new Date();
  const stamp = `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${date.getFullYear()}`;
  return `TMH/${Math.floor(2000 + Math.random() * 8000)}/${stamp}`;
};

const getLoggedUser = () => {
  const userId = sessionStorage.getItem(USER_SESSION_KEY);
  return getStored(USER_STORAGE_KEY).find((user) => user.userId === userId || user.email === userId);
};

const getAllBookings = () => getStored(BOOKING_STORAGE_KEY);

const getDashboardCustomers = () => [...sampleCustomers, ...getAllBookings()];

const getFilteredCustomers = () => {
  if (!destinationFilter || destinationFilter.value === "all") {
    return getDashboardCustomers();
  }

  return getDashboardCustomers().filter((customer) => customer.destination === destinationFilter.value);
};

const renderDestinationOptions = () => {
  const destinations = [...new Set(getDashboardCustomers().map((customer) => customer.destination))];
  const selectedDestination = destinationFilter.value || "all";

  destinationFilter.innerHTML = [
    '<option value="all">All Destinations</option>',
    ...destinations.map((destination) => `<option value="${destination}">${destination}</option>`),
  ].join("");

  destinationFilter.value = destinations.includes(selectedDestination) ? selectedDestination : "all";
};

const renderSummary = () => {
  const visibleCustomers = getFilteredCustomers();
  const totalPaid = visibleCustomers.reduce((sum, customer) => sum + Number(customer.paidAmount), 0);
  const totalBalance = visibleCustomers.reduce((sum, customer) => sum + balance(customer), 0);
  const pendingPayments = getDashboardCustomers().filter((customer) => customer.status !== "confirmed").length;

  document.querySelector("#totalCustomers").textContent = visibleCustomers.length;
  document.querySelector("#totalPaid").textContent = money(totalPaid);
  document.querySelector("#totalBalance").textContent = money(totalBalance);
  document.querySelector("#pendingPayments").textContent = pendingPayments;
};

const renderRows = () => {
  const visibleCustomers = getFilteredCustomers();

  if (visibleCustomers.length === 0) {
    customerRows.innerHTML = '<tr><td colspan="8">No customers found for this destination.</td></tr>';
    return;
  }

  customerRows.innerHTML = visibleCustomers
    .map((customer) => {
      const isPending = customer.status !== "confirmed";
      const receiptButton = isPending
        ? '<button type="button" disabled>PDF Receipt</button>'
        : `<button type="button" data-download="${customer.id}">PDF Receipt</button>`;
      const confirmButton = isPending ? `<button type="button" data-confirm="${customer.id}">Confirm</button>` : "";

      return `
        <tr>
          <td>${customer.receiptNo}</td>
          <td>${customer.name}</td>
          <td>${customer.destination}</td>
          <td>${customer.date}</td>
          <td>${money(customer.paidAmount)}</td>
          <td>${money(balance(customer))}</td>
          <td>${customer.status === "confirmed" ? "Confirmed" : "Pending"}</td>
          <td>
            <div class="row-actions">
              <button type="button" data-view="${customer.id}">View</button>
              ${confirmButton}
              ${receiptButton}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
};

const escapePdfText = (value) => String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const makePdf = (lines) => {
  const content = [
    "BT",
    "/F1 22 Tf",
    "50 790 Td",
    "(Travel Mithra Holidays) Tj",
    "/F1 12 Tf",
    "0 -26 Td",
    "(KS3, Heavenly Plaza, Padamugal, Kakkanadu, Cochin - 21) Tj",
    "0 -18 Td",
    "(PH: 8129430111) Tj",
    "/F1 18 Tf",
    "0 -34 Td",
    "(PAYMENT RECEIPT) Tj",
    "/F1 12 Tf",
    ...lines.flatMap((line) => ["0 -22 Td", `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const downloadReceipt = (customer) => {
  if (customer.status !== "confirmed") {
    return;
  }

  const lines = [
    `Receipt No: ${customer.receiptNo}`,
    `Date: ${customer.date}`,
    `Customer: ${customer.name}`,
    `User ID: ${customer.userId || "-"}`,
    `Destination: ${customer.destination}`,
    `Group: ${customer.group}`,
    `Payment Mode: ${customer.paymentMode}`,
    `Payment Accepted By: ${customer.acceptedBy || "Travel Mithra Admin"}`,
    `Paid Amount: ${money(customer.paidAmount)}`,
    `Total Amount: ${money(customer.totalAmount)}`,
    `Balance Amount: ${money(balance(customer))}`,
    `Status: Confirmed`,
    `Remarks: ${customer.remarks || "-"}`,
    "Note: This receipt is available after admin payment confirmation.",
  ];
  const url = URL.createObjectURL(makePdf(lines));
  const link = document.createElement("a");

  link.href = url;
  link.download = `${customer.receiptNo.replaceAll("/", "-")}-${customer.name}-receipt.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

const renderDashboard = () => {
  renderDestinationOptions();
  renderSummary();
  renderRows();
};

const renderUserTrips = () => {
  const user = getLoggedUser();
  const trips = getAllBookings().filter((booking) => booking.userId === user?.userId);

  userWelcome.textContent = user ? `Welcome, ${user.name}` : "User Portal";

  if (!trips.length) {
    userTripRows.innerHTML = '<tr><td colspan="5">No trips selected yet.</td></tr>';
    return;
  }

  userTripRows.innerHTML = trips
    .map((trip) => {
      const receiptButton =
        trip.status === "confirmed"
          ? `<button type="button" data-user-download="${trip.id}">Download PDF</button>`
          : '<button type="button" disabled>Waiting Approval</button>';

      return `
        <tr>
          <td>${trip.receiptNo}</td>
          <td>${trip.destination}</td>
          <td>${money(trip.paidAmount)}</td>
          <td>${trip.status === "confirmed" ? "Confirmed" : "Pending"}</td>
          <td>${receiptButton}</td>
        </tr>
      `;
    })
    .join("");
};

const showHome = () => {
  dashboardView.classList.add("hidden");
  userPortalView.classList.add("hidden");
  loginView.classList.add("hidden");
  customerHomeView.classList.remove("hidden");
  loginView.setAttribute("aria-hidden", "true");
};

const showDashboard = () => {
  loginView.classList.add("hidden");
  customerHomeView.classList.add("hidden");
  userPortalView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  renderDashboard();
};

const showUserPortal = () => {
  loginView.classList.add("hidden");
  customerHomeView.classList.add("hidden");
  dashboardView.classList.add("hidden");
  userPortalView.classList.remove("hidden");
  renderUserTrips();
  applyPendingTripSearch();
};

const showLoginScreen = (authMode = "login") => {
  dashboardView.classList.add("hidden");
  userPortalView.classList.add("hidden");
  customerHomeView.classList.remove("hidden");
  loginView.classList.remove("hidden");
  loginView.setAttribute("aria-hidden", "false");
  setAuthMode(authMode);
};

const closeAuthPanel = () => {
  loginView.classList.add("hidden");
  loginView.setAttribute("aria-hidden", "true");
};

const findDemoAdmin = (login, password) =>
  demoAdmins.find((admin) => (admin.userId === login || admin.email === login.toLowerCase()) && admin.password === password);

const findLocalAdmin = (login, password) =>
  getStored(LOCAL_ADMIN_STORAGE_KEY).find((admin) => (admin.userId === login || admin.email === login.toLowerCase()) && admin.password === password);

const registerUser = async ({ name, userId, email, phone, password }) => {
  const approvedAdmin = demoAdmins.find((admin) => admin.userId === userId && admin.email === email);

  if (approvedAdmin) {
    try {
      await apiPost("/api/admin/register", { name, adminId: userId, email, password });
    } catch (error) {
      // Keep the demo usable when MySQL credentials are not configured yet.
    }

    const localAdmins = getStored(LOCAL_ADMIN_STORAGE_KEY).filter((admin) => admin.userId !== userId && admin.email !== email);
    localAdmins.push({ name, userId, email, phone, password });
    setStored(LOCAL_ADMIN_STORAGE_KEY, localAdmins);
    return "admin";
  }

  const users = getStored(USER_STORAGE_KEY);

  if (users.some((user) => user.userId === userId || user.email === email)) {
    throw new Error("User ID or email is already registered");
  }

  users.push({ name, userId, email, phone, password });
  setStored(USER_STORAGE_KEY, users);
  return "user";
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const login = document.querySelector("#adminId").value.trim();
  const password = document.querySelector("#adminPassword").value;

  if (!login || !password) {
    loginError.textContent = "User ID or email and password are required";
    return;
  }

  const user = getStored(USER_STORAGE_KEY).find((item) => (item.userId === login || item.email === login.toLowerCase()) && item.password === password);

  if (user) {
    sessionStorage.setItem(USER_SESSION_KEY, user.userId);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    showUserPortal();
    return;
  }

  try {
    const result = await apiPost("/api/admin/login", { adminId: login, password });
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    sessionStorage.setItem(ADMIN_TOKEN_KEY, result.token);
    sessionStorage.removeItem(USER_SESSION_KEY);
    showDashboard();
    return;
  } catch (error) {
    const localAdmin = findDemoAdmin(login, password) || findLocalAdmin(login, password);

    if (!localAdmin) {
      loginError.textContent = "Invalid login details";
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(USER_SESSION_KEY);
    showDashboard();
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("#registerName").value.trim();
  const userId = document.querySelector("#registerAdminId").value.trim();
  const email = document.querySelector("#registerAdminEmail").value.trim().toLowerCase();
  const phone = document.querySelector("#registerPhone").value.trim();
  const password = document.querySelector("#registerPassword").value;
  const confirmPassword = document.querySelector("#confirmPassword").value;

  if (!name || !userId || !email || !phone || !password || !confirmPassword) {
    registerMessage.textContent = "All registration fields are required";
    return;
  }

  if (password.length < 6) {
    registerMessage.textContent = "Password must be at least 6 characters";
    return;
  }

  if (password !== confirmPassword) {
    registerMessage.textContent = "Passwords do not match";
    return;
  }

  try {
    await registerUser({ name, userId, email, phone, password });
    document.querySelector("#adminId").value = userId;
    document.querySelector("#adminPassword").value = "";
    setAuthMode("login");
    loginError.textContent = "Registration completed. Please login.";
  } catch (error) {
    registerMessage.textContent = error.message || "Registration failed";
  }
});

tripPaymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = getLoggedUser();
  const selectedOption = tripDestination.options[tripDestination.selectedIndex];
  const destination = selectedOption.value;
  const totalAmount = Number(selectedOption.dataset.price || 0);
  const paidAmount = Number(paymentAmount.value);
  const tripDate = document.querySelector("#tripDate").value;
  const travellers = Number(document.querySelector("#travellerCount").value || 1);
  const paymentMode = document.querySelector("#paymentMode").value;

  if (!user) {
    paymentMessage.textContent = "Please login before making payment";
    return;
  }

  if (!destination || !tripDate || !paidAmount || paidAmount <= 0) {
    paymentMessage.textContent = "Destination, trip date, and payment amount are required";
    return;
  }

  const bookings = getAllBookings();

  bookings.push({
    id: `booking-${Date.now()}`,
    receiptNo: makeReceiptNo(),
    date: tripDate,
    name: user.name,
    userId: user.userId,
    address: user.phone,
    destination,
    group: `${travellers} Traveller${travellers > 1 ? "s" : ""}`,
    paymentMode,
    acceptedBy: "",
    totalAmount,
    paidAmount,
    status: "pending",
    remarks: "Payment submitted by user. Awaiting admin confirmation.",
  });

  setStored(BOOKING_STORAGE_KEY, bookings);
  sessionStorage.removeItem("travelmithra_pending_trip_search");
  tripPaymentForm.reset();
  document.querySelector("#travellerCount").value = 1;
  paymentMessage.textContent = "Payment confirmed. Receipt will unlock after admin approval.";
  renderUserTrips();
});

showRegister.addEventListener("click", () => setAuthMode("register"));
showLogin.addEventListener("click", () => setAuthMode("login"));

togglePassword.addEventListener("click", () => {
  const shouldShowPassword = adminPasswordInput.type === "password";

  adminPasswordInput.type = shouldShowPassword ? "text" : "password";
  passwordIcon.textContent = shouldShowPassword ? "Hide" : "View";
});

accountMenuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  tourFilterMenu.classList.add("hidden");
  accountMenu.classList.toggle("hidden");
});

accountMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-auth]");

  if (!button) {
    return;
  }

  accountMenu.classList.add("hidden");
  showLoginScreen(button.dataset.auth);
});

headerSearchButton.addEventListener("click", () => {
  document.querySelector(".trip-search-panel").scrollIntoView({ behavior: "smooth", block: "center" });
  homeDestination.focus();
});

filterButton.addEventListener("click", (event) => {
  event.stopPropagation();
  accountMenu.classList.add("hidden");
  tourFilterMenu.classList.toggle("hidden");
});

tourFilterMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter-destination]");

  if (!button) {
    return;
  }

  const destination = button.dataset.filterDestination;
  filterTours(destination);
  tourFilterMenu.classList.add("hidden");

  if (destination !== "all") {
    homeDestination.value = destination;
    document.querySelector("#tours").scrollIntoView({ behavior: "smooth" });
  }
});

searchSubmit.addEventListener("click", openTripSelection);
bookCta.addEventListener("click", openTripSelection);

homeDestination.addEventListener("change", () => {
  if (homeDestination.value) {
    filterTours(homeDestination.value);
  }
});

document.querySelectorAll(".destination-card").forEach((card) => {
  card.addEventListener("click", () => {
    const destinationName = card.querySelector("strong")?.textContent.trim();
    const destination = destinationNameMap[destinationName];

    if (!destination) {
      return;
    }

    homeDestination.value = destination;
    filterTours(destination);
    document.querySelector(".trip-search-panel").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

tripDestination.addEventListener("change", () => {
  const selectedOption = tripDestination.options[tripDestination.selectedIndex];

  if (selectedOption?.dataset.price) {
    paymentAmount.value = selectedOption.dataset.price;
  }
});

document.addEventListener("click", (event) => {
  if (!accountMenu.contains(event.target) && !accountMenuButton.contains(event.target)) {
    accountMenu.classList.add("hidden");
  }

  if (!tourFilterMenu.contains(event.target) && !filterButton.contains(event.target)) {
    tourFilterMenu.classList.add("hidden");
  }
});

closeLoginView.addEventListener("click", closeAuthPanel);

loginView.addEventListener("click", (event) => {
  if (event.target === loginView) {
    closeAuthPanel();
  }
});

document.querySelector("#logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  showHome();
});

document.querySelector("#adminBackButton").addEventListener("click", () => {
  showHome();
});

document.querySelector("#userPortalBackButton").addEventListener("click", () => {
  showHome();
});

document.querySelector("#userPortalLogoutButton").addEventListener("click", () => {
  sessionStorage.removeItem(USER_SESSION_KEY);
  showHome();
});

destinationFilter.addEventListener("change", () => {
  renderSummary();
  renderRows();
});

customerRows.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button");

  if (!actionButton) {
    return;
  }

  const viewId = actionButton.dataset.view;
  const confirmId = actionButton.dataset.confirm;
  const downloadId = actionButton.dataset.download;
  const id = viewId || confirmId || downloadId;
  const customer = getDashboardCustomers().find((item) => item.id === id);

  if (!customer) {
    return;
  }

  if (viewId) {
    alert(
      [
        `Customer: ${customer.name}`,
        `User ID: ${customer.userId || "-"}`,
        `Destination: ${customer.destination}`,
        `Trip Date: ${customer.date}`,
        `Payment Mode: ${customer.paymentMode}`,
        `Paid: ${money(customer.paidAmount)}`,
        `Balance: ${money(balance(customer))}`,
        `Status: ${customer.status === "confirmed" ? "Confirmed" : "Pending"}`,
      ].join("\n"),
    );
  } else if (confirmId) {
    const bookings = getAllBookings().map((booking) =>
      booking.id === confirmId
        ? { ...booking, status: "confirmed", acceptedBy: "Travel Mithra Admin", remarks: "Payment confirmed by admin." }
        : booking,
    );
    setStored(BOOKING_STORAGE_KEY, bookings);
    renderDashboard();
  } else if (downloadId) {
    downloadReceipt(customer);
  }
});

userTripRows.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-user-download]");

  if (!actionButton) {
    return;
  }

  const trip = getAllBookings().find((booking) => booking.id === actionButton.dataset.userDownload);

  if (trip) {
    downloadReceipt(trip);
  }
});

if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
  showDashboard();
} else if (sessionStorage.getItem(USER_SESSION_KEY)) {
  showUserPortal();
} else {
  showHome();
}
