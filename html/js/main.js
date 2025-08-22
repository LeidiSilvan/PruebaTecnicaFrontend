// funcion evento click
document.addEventListener('DOMContentLoaded', function() {

	const loadBtn = document.querySelector('button.btn.btn-primary');


  //modal de visualizacion de productos
	const cardsContainer = document.querySelector('.row.row-cols-1.row-cols-sm-2.row-cols-md-3.g-3');


	let modalDiv = document.getElementById('productModal');
	if (!modalDiv) {
		modalDiv = document.createElement('div');
		modalDiv.id = 'productModal';
		modalDiv.className = 'modal fade';
		modalDiv.tabIndex = -1;
		modalDiv.innerHTML = `
		<div class=\"modal-dialog\">
		  <div class=\"modal-content\">
			<div class=\"modal-header\">
			  <h5 class=\"modal-title\" id=\"modalTitle\"></h5>
			  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>
			</div>
			<div class=\"modal-body\" id=\"modalBody\"></div>
		  </div>
		</div>`;
		document.body.appendChild(modalDiv);
	}

	// get para mostrat el modal con la informacion del producto
	function showModal(product) {
		const modalTitle = document.getElementById('modalTitle');
		const modalBody = document.getElementById('modalBody');
		modalTitle.textContent = product.title;
		let imagesHtml = '';
		if (product.images && product.images.length > 1) {
			if (product.images[1]) imagesHtml += `<img src='${product.images[1]}' class='img-fluid mb-2' alt='img2'>`;
			if (product.images[2]) imagesHtml += `<img src='${product.images[2]}' class='img-fluid mb-2' alt='img3'>`;
		}
		modalBody.innerHTML = `
			<p><strong>Descripción:</strong> ${product.description}</p>
			<p><strong>Categoría:</strong> ${product.category?.name || 'Sin categoría'}</p>
			${imagesHtml}
		`;
		const modal = new bootstrap.Modal(modalDiv);
		modal.show();
	}

	// Funcion para crear una card de producto
	function createProductCard(product) {
		const col = document.createElement('div');
		col.className = 'col';


    //condicionales para las imagenes
		let imgSrc = '';
if (Array.isArray(product.images) && product.images.length > 0) {
  if (typeof product.images[0] === 'string' && product.images[0].match(/^https?:\/\//)) {
    imgSrc = product.images[0];
  }
}
		col.innerHTML = `
		<div class="card h-100 shadow-sm">
			<img src="${imgSrc}" class="card-img-top" alt="${product.title}" style="height:225px;object-fit:cover;" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x225?text=Sin+Imagen';">
			<div class="card-body d-flex flex-column">
				<h5 class="card-title">${product.title}</h5>
				<p class="card-text">${product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}</p>
				<div class="mt-auto d-flex justify-content-between align-items-center">
					<button type="button" class="btn btn-sm btn-outline-secondary view-btn">View</button>
					<span class="text-body-secondary fw-bold">$ ${product.price}</span>
				</div>
			</div>
		</div>
		`;
		// evento click para cargar el modal con la informacion del producto
		col.querySelector('.view-btn').addEventListener('click', function() {
			showModal(product);
		});
		return col;
	}

	// condicionales para evento click y que se carguen los productos
	if (loadBtn) {
		loadBtn.addEventListener('click', async function() {
			loadBtn.disabled = true;
			loadBtn.textContent = 'Loading...';
			try {
				const res = await fetch('https://api.escuelajs.co/api/v1/products');
				const products = await res.json();
        console.log('Total productos recibidos:', products.length);
				cardsContainer.innerHTML = '';
				products.slice(0, 41).forEach(product => {
					const card = createProductCard(product);
					cardsContainer.appendChild(card);
				});
			} catch (err) {
				alert('Error al cargar productos');
			}
			loadBtn.disabled = false;
			loadBtn.textContent = 'Load Products';
		});
	}
});

