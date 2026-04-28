// --- STATE ---
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Food', 'Salary', 'Rent', 'General'];
let editId = null;
let chartD, chartB;

// --- DOM ELEMENTS ---
const transForm = document.getElementById('trans-form');
const catForm = document.getElementById('cat-form');
const themeBtn = document.getElementById('theme-toggle');
const mgrToggleBtn = document.getElementById('mgr-toggle-btn');
const managerList = document.getElementById('manager-list');
const searchInput = document.getElementById('search');

// --- INITIALIZATION ---
window.onload = () => {
    document.getElementById('date').valueAsDate = new Date();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateUI();
};

// --- THEME & DROPDOWN TOGGLES ---
themeBtn.onclick = () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateUI(); // Redraw charts for color consistency
};

mgrToggleBtn.onclick = (e) => {
    e.stopPropagation();
    const isVisible = managerList.style.display === 'block';
    managerList.style.display = isVisible ? 'none' : 'block';
    
    // Visual indicator: darken the button when open
    mgrToggleBtn.style.filter = isVisible ? 'brightness(100%)' : 'brightness(80%)';
};

// Close dropdown when clicking outside
window.onclick = (e) => {
    if (!managerList.contains(e.target) && e.target !== mgrToggleBtn) {
        managerList.style.display = 'none';
    }
};

// --- LOGIC ---
function deleteCategory(name) {
    if (name === 'General') return alert("General is the default category and cannot be deleted.");
    if (confirm(`Delete category "${name}"? Transactions will move to "General".`)) {
        transactions = transactions.map(t => t.category === name ? { ...t, category: 'General' } : t);
        categories = categories.filter(c => c !== name);
        updateUI();
    }
}

function handleForm(e) {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const amount = +document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('cat-select').value;

    if (editId) {
        const i = transactions.findIndex(t => t.id === editId);
        transactions[i] = { ...transactions[i], text, amount, date, category };
        editId = null;
    } else {
        transactions.push({ id: Date.now(), text, amount, date, category });
    }
    updateUI();
    resetForm();
}

function resetForm() {
    editId = null;
    transForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('submit-btn').innerText = 'Save Transaction';
    document.getElementById('cancel-btn').style.display = 'none';
}

function updateUI() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('categories', JSON.stringify(categories));

    // Update Dropdown Selection
    document.getElementById('cat-select').innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');

    // Update Manager Dropdown List
    managerList.innerHTML = categories.map(c => `
        <div class="cat-row">
            <span>${c}</span>
            ${c !== 'General' ? `<button onclick="deleteCategory('${c}')" style="width:auto; padding:2px 8px; background:var(--expense)">Delete</button>` : '<small>(Default)</small>'}
        </div>
    `).join('');

    // Calculations
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
    const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
    const exp = Math.abs(amounts.filter(a => a < 0).reduce((a, b) => a + b, 0)).toFixed(2);

    document.getElementById('balance').innerText = `$${total}`;
    document.getElementById('money-plus').innerText = `+$${inc}`;
    document.getElementById('money-minus').innerText = `-$${exp}`;

    renderHistory(transactions);
    drawCharts(inc, exp);
}

function renderHistory(data) {
    const list = document.getElementById('list');
    list.innerHTML = '';
    data.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
        const li = document.createElement('li');
        li.className = t.amount < 0 ? 'minus' : 'plus';
        li.innerHTML = `
            <div><strong>${t.text}</strong><br><small>${t.date} | ${t.category}</small></div>
            <div>
                $${Math.abs(t.amount)}
                <button style="width:auto; padding:4px 8px;" onclick="startEdit(${t.id})">✎</button>
                <button style="width:auto; padding:4px 8px; background:var(--expense);" onclick="removeTrans(${t.id})">x</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function startEdit(id) {
    const t = transactions.find(t => t.id === id);
    document.getElementById('text').value = t.text;
    document.getElementById('amount').value = t.amount;
    document.getElementById('date').value = t.date;
    document.getElementById('cat-select').value = t.category;
    editId = id;
    document.getElementById('submit-btn').innerText = 'Update';
    document.getElementById('cancel-btn').style.display = 'inline';
}

function removeTrans(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
}

searchInput.oninput = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = transactions.filter(t => t.text.toLowerCase().includes(term) || t.category.toLowerCase().includes(term));
    renderHistory(filtered);
};

function drawCharts(inc, exp) {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const txtColor = isDark ? '#ffffff' : '#2c3e50';

    // Doughnut
    if (chartD) chartD.destroy();
    const catExps = categories.map(c => transactions.filter(t => t.category === c && t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0));
    chartD = new Chart(document.getElementById('dChart'), {
        type: 'doughnut',
        data: { labels: categories, datasets: [{ data: catExps, backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'] }] },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: txtColor } } } 
        }
    });

    // Bar
    if (chartB) chartB.destroy();
    chartB = new Chart(document.getElementById('bChart'), {
        type: 'bar',
        data: { labels: ['Income', 'Expense'], datasets: [{ data: [inc, exp], backgroundColor: ['#2ecc71', '#e74c3c'] }] },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { y: { ticks: { color: txtColor } }, x: { ticks: { color: txtColor } } },
            plugins: { legend: { display: false } }
        }
    });
}

document.getElementById('cancel-btn').onclick = resetForm;
transForm.onsubmit = handleForm;
catForm.onsubmit = (e) => {
    e.preventDefault();
    const val = document.getElementById('new-cat').value.trim();
    if (val && !categories.includes(val)) {
        categories.push(val);
        updateUI();
        document.getElementById('new-cat').value = '';
    }
};