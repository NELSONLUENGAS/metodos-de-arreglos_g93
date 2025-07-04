const freeIcons = [
	'fa-bed',
	'fa-spa',
	'fa-utensils',
	'fa-wifi',
	'fa-tshirt',
	'fa-swimming-pool',
	'fa-dumbbell',
	'fa-car',
	'fa-shuttle-van',
	'fa-tv',
	'fa-coffee',
	'fa-cocktail',
	'fa-bicycle',
	'fa-child',
	'fa-business-time',
	'fa-paw',
	'fa-gift',
	'fa-umbrella-beach',
	'fa-shopping-cart',
	'fa-key',
	'fa-first-aid',
	'fa-phone',
	'fa-water',
];

const initialServices = [
	{
		id: 1,
		name: 'Servicio a la Habitación',
		icon: 'fa-bed',
		description: 'Comidas y bebidas servidas en su habitación',
	},
	{
		id: 2,
		name: 'Acceso al Spa',
		icon: 'fa-spa',
		description: 'Acceso completo a nuestras instalaciones de spa',
	},
	{
		id: 3,
		name: 'Desayuno Buffet',
		icon: 'fa-utensils',
		description: 'Desayuno buffet con variedad de opciones',
	},
	{
		id: 4,
		name: 'Wifi Premium',
		icon: 'fa-wifi',
		description: 'Internet de alta velocidad en todo el hotel',
	},
	{
		id: 5,
		name: 'Lavandería',
		icon: 'fa-tshirt',
		description: 'Servicio de lavandería express',
	},
	{
		id: 6,
		name: 'Piscina',
		icon: 'fa-swimming-pool',
		description: 'Acceso a la piscina climatizada',
	},
];

let services = [...initialServices];
let newId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
let selectedIcon = null;

function getElement(id) {
	return document.getElementById(id);
}
// elementos del DOM
const servicesContainer = getElement('services-container');
const serviceCounter = getElement('service-counter');
const emptyState = getElement('empty-state');
const resetBtn = getElement('reset-btn');
const clearBtn = getElement('clear-btn');
const notification = getElement('notification');
const toggleFormBtn = getElement('toggle-form-btn');
const formContainer = getElement('form-container');
const addServiceForm = getElement('add-service-form');
const iconSelector = getElement('icon-selector');
const serviceName = getElement('service-name');
const serviceDescription = getElement('service-description');

function populateIconSelector() {
	iconSelector.innerHTML = '';

	freeIcons.forEach((icon) => {
		const iconElement = document.createElement('div');
		iconElement.className = 'icon-option';
		iconElement.innerHTML = `<i class="fa-solid ${icon}"></i>`;
		iconElement.dataset.person = icon;

		iconElement.addEventListener('click', () => {
			// remover seleccionados
			document.querySelectorAll('.icon-option').forEach((option) => {
				option.classList.remove('selected');
			});

			// selecionar el nuevo icono
			iconElement.classList.add('selected');
			selectedIcon = icon;
		});

		iconSelector.appendChild(iconElement);
	});
}

function renderServices() {
	servicesContainer.innerHTML = '';

	if (!services.length) {
		emptyState.classList.remove('hidden');
		serviceCounter.textContent = '0 servicios disponibles';
		return;
	}

	emptyState.classList.add('hidden');
	serviceCounter.textContent = `${services.length} servicio${
		services.length > 1 ? 's' : ''
	} disponibles`;

	services.forEach((service) => {
		const serviceCard = document.createElement('div');
		serviceCard.className = 'service-card pulse';
		serviceCard.innerHTML = `
            <div class="flex flex-col h-full p-6">
                <div class="flex items-center mb-4">
                    <div class="service-icon mr-4">
                        <i class="fa-solid ${service.icon}"></i>
                    </div>
                    <h3 class="font-bold text-lg text-gray-800">${service.name}</h3>
                </div>
                <p class="text-gray-600 mb-6 flex-grow text-sm">${service.description}</p>
                <button class="delete-btn bg-[#e53e3e] hover:bg-[#c53030] text-white py-2 px-4 rounded-lg w-full flex items-center justify-center" data-id="${service.id}">
                    <i class="fas fa-trash-alt mr-2"></i> Eliminar
                </button>
            </div>
        `;

		servicesContainer.appendChild(serviceCard);
	});

	document.querySelectorAll('.delete-btn').forEach((button) => {
		button.addEventListener('click', () => {
			const id = parseInt(button.getAttribute('data-id'));
			const service = services.find((s) => s.id === id);
			if (service) {
				deleteService(id);
				showNotification(`${service.name} eliminado`);
			}
		});
	});
}

function deleteService(id) {
	services = services.filter((service) => service.id !== id);
	renderServices();
}

function restoreServices() {
	services = [...initialServices];
	renderServices();
	showNotification(`Servicios restaurados`);
}

function clearServices() {
	if (!services.length) {
		showNotification(`No hay servicios para eliminar`);
		return;
	}

	services = [];
	renderServices();
	showNotification(`Todos los servicios eliminados`);
}

function showNotification(message, isError = false) {
	notification.querySelector('span').textContent = message;
	notification.className = 'notification';

	if (isError) {
		notification.classList.add('bg-red-600');
	} else {
		notification.classList.add('bg-green-600');
	}

	notification.classList.add('show');

	setTimeout(() => {
		notification.classList.remove('show');
	}, 3000);
}

function addNewService(event) {
	event.preventDefault();

	const name = serviceName.value.trim();
	const description = serviceDescription.value.trim();

	if (!name || !description) {
		showNotification('Por favor completa todos los datos', true);
		return;
	}

	if (!selectedIcon) {
		showNotification('Por favor seleciona un icono', true);
		return;
	}

	const newService = {
		id: parseInt(newId),
		name,
		icon: selectedIcon,
		description,
	};

	services.unshift(newService);
	renderServices();

	addServiceForm.reset();
	document.querySelectorAll('.icon-option').forEach((opt) => {
		opt.classList.remove('selected');
	});

	selectedIcon = null;

	showNotification(`"${name}" agregado correctamente`);

	formContainer.classList.remove('open');
	toggleFormBtn.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
	populateIconSelector();
	renderServices();

	// Event listeners
	resetBtn.addEventListener('click', restoreServices);
	clearBtn.addEventListener('click', clearServices);

	toggleFormBtn.addEventListener('click', () => {
		formContainer.classList.toggle('open');
		toggleFormBtn.classList.toggle('open');
	});

	addServiceForm.addEventListener('submit', addNewService);
});
