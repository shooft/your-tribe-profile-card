const hetHooft = document.querySelector(".👨‍🦲");





//////////////
// MOOD CHANGE
//////////////

const iniMoodChange = () => {
	document.querySelector("body .🎛").onchange = (e) => {
    document.documentElement.dataset.mood = e.target.value;
	}
}





//////////
// GLIMMER
//////////

const iniMoveGlimmer = () => {
	const dragContainer = document.querySelector(".🌟");
	const dragElement = document.querySelector(".🌟 em");

	const xMin = getComputedStyle(document.documentElement).getPropertyValue("--head-glimmer-x-min");
	const xMax = getComputedStyle(document.documentElement).getPropertyValue("--head-glimmer-x-max");
	const xDefault = getComputedStyle(document.documentElement).getPropertyValue("--head-light-x-default");
	const yMin = getComputedStyle(document.documentElement).getPropertyValue("--head-glimmer-y-min");
	const yMax = getComputedStyle(document.documentElement).getPropertyValue("--head-glimmer-y-max");
	const yDefault = getComputedStyle(document.documentElement).getPropertyValue("--head-light-y-default");

	let elementHovered = false;
	let dragging = false;

	let xOffset;
	let yOffset;

	// event om pointerup event met code te kunnen activeren
	const pointerUp = new PointerEvent('pointerup');


	/////////////////////////////////////////////////////
	// x en y uit localstorage herstellen indien aanwezig
	if(isNumeric(localStorage.getItem('--head-light-x')) && localStorage.getItem('--head-light-x')) {
		hetHooft.style.setProperty("--head-light-x", localStorage.getItem('--head-light-x'));
	} else {
		hetHooft.style.setProperty("--head-light-x", xDefault);
	}
	if(isNumeric(localStorage.getItem('--head-light-y')) && localStorage.getItem('--head-light-y')) {
		hetHooft.style.setProperty("--head-light-y", localStorage.getItem('--head-light-y'));
	} else {
		hetHooft.style.setProperty("--head-light-y", yDefault);
	}


	//////////////////////////////
	// track if glimmer is hovered
	dragElement.onpointerenter = () => {
		elementHovered = true;
	}

	dragElement.onpointerleave = () => {
		elementHovered = false;
	}
	

	//////////////////
	// handle dragging
	const startDragging = e => {
		if(elementHovered) {
			dragging = true;
			// de container (ul) weet dat er gedragged wordt
			// nodig voor cursor en transitie van li's
			hetHooft.classList.add("dragging");

			const pointerX = e.clientX;
			const pointerY = e.clientY;

			const glimmerRectangle = dragElement.getBoundingClientRect();
			let glimmerWidth = glimmerRectangle.width;
			let glimmerHeight = glimmerRectangle.height;
			let glimmerLeft = glimmerRectangle.left;
			let glimmerTop = glimmerRectangle.top;

			xOffset = pointerX - glimmerLeft - glimmerWidth/2;
			yOffset = pointerY - glimmerTop - glimmerHeight/2 - 8;
		}
	} 

	const handleDragging = e => {
		const pointerX = e.clientX;
		const pointerY = e.clientY;

		const containerRectangle = dragContainer.getBoundingClientRect();
		let containerWidth = containerRectangle.width;
		let containerHeight = containerRectangle.height;
		let containerLeft = containerRectangle.left;
		let containerTop = containerRectangle.top;

		let containerPointerX = pointerX - containerLeft - xOffset;
		let x = containerPointerX / containerWidth;
		let containerPointerY = pointerY - containerTop - yOffset;
		let y = containerPointerY / containerHeight;

		updatePos("x", x);
		updatePos("y", y);
	}


	const stopDragging = () => {
		dragging = false;

		// de container (ul) weet dat er gedragged wordt
		// nodig voor cursor en transitie van li's
		hetHooft.classList.remove("dragging");
	}
	
	// als de gebruiker op de muis klikt
	// of met vinger scherm aanraakt
	dragContainer.onpointerdown = e => {
		startDragging(e);
	}

	// als de gebruiken de muis na klikken beweegt
	// of met vinger op scherm beweegt
	dragContainer.onpointermove = e => {
		if (dragging) {
			handleDragging(e);
		}
	}

	// als gebruiker muis loslaat
	// of vinger van scherm haalt
	dragContainer.onpointerup = () => {
		if(dragging) {
			stopDragging();
		}
	}

	// als gebruiker muis buiten section beweegt
	// of vinger buiten section beweegt
	dragContainer.onpointerleave = () => {
		dragContainer.dispatchEvent(pointerUp);
	}

	// als gebruiker muis een tijdje niet beweegt
	// of vinger een tijdje niet beweegt
	dragContainer.onpointercancel = () => {
		dragContainer.dispatchEvent(pointerUp);
	}


	//////////////////
	// handle keyboard
	const startNudgeGlimmer = e => {
		const nudgeGlimmer = (axis, direction) => {
			let pos = parseFloat(hetHooft.style.getPropertyValue("--head-light-"+axis)) + .0075 * direction;

			updatePos(axis, pos);
			hetHooft.classList.add("moving"); // voor smooth transition
		}

		switch (e.key) {
			case 'ArrowRight':
				nudgeGlimmer("x", 1)
				break;
			case 'ArrowLeft':
				nudgeGlimmer("x", -1)
				break;
			case 'ArrowUp':
				nudgeGlimmer("y", -1)
				break;
			case 'ArrowDown':
				nudgeGlimmer("y", 1)
				break;
		}
	}

	const endNudgeGlimmer = e => {
		if (hetHooft.classList.contains("moving")) {
			e.target.addEventListener("transitionend", (e) => {
				hetHooft.classList.remove("moving"); // weer directe transition
			}, {once: true});
		}
	}

	// naar pijltjes laten luisteren
	dragElement.onkeydown = e => {
		startNudgeGlimmer(e)
	};
	dragElement.onkeyup  = e => {
		endNudgeGlimmer(e)
	};
}


///////////////
// move glimmer
const updatePos = (axis, pos) => {
	const minPos = parseFloat( getComputedStyle(document.documentElement).getPropertyValue("--head-glimmer-"+axis+"-min") );
	const maxPos = parseFloat( getComputedStyle(document.documentElement).getPropertyValue("--head-glimmer-"+axis+"-max") );

	if (pos > maxPos) {
		pos = maxPos;
	}
	else if (pos < minPos) {
		pos = minPos;
	}

	hetHooft.style.setProperty("--head-light-"+axis, pos);
	localStorage.setItem("--head-light-"+axis, pos);
}





////////////////////
// INI FLIPPERDEFLIP
////////////////////

function iniFlipperDeFlip() {
	const cube = document.querySelector("article");
	const cubeFrontPanel = cube.querySelector("section:nth-of-type(1)");
	const cubeBackPanel = cube.querySelector("section:nth-of-type(4)");

	function flipperDeFlip()	{
		cube.classList.add("flipped");
	}
	
	function pilfEdReppilf()	{
		cube.classList.remove("flipped");
		if (cubeBackPanel.querySelectorAll(":focus").length > 0) {
			cubeBackPanel.querySelector(":focus").blur();
		}
	}
	

	/////////
	// clicks
	function cubeFrontPanelCLick(e) {
		if(e.target.nodeName == "EM" || e.target.nodeName == "INPUT") {
			// do nothing
		} else {
			flipperDeFlip();
		}
	}

	function cubeBackPanelCLick(e) {
		if(e.target.nodeName == "A") {
			// do nothing
		} else {
			pilfEdReppilf();
		}
	}

	cubeFrontPanel.onclick = cubeFrontPanelCLick;
	cubeBackPanel.onclick = cubeBackPanelCLick;

	/////////////////////////////
	// tab into back panel - open
	cubeBackPanel.addEventListener("focusin", () => {
		flipperDeFlip();
	});

	////////////////////////
	// tab out of back panel
	window.addEventListener('keydown', e => {
		if (e.key == "Tab") {
			if (cube.classList.contains("flipped")) {
				setTimeout(function(){ 
					if (cubeBackPanel.querySelectorAll(":focus").length == 0) {
						pilfEdReppilf();
					}
				}, 10);
			}
		}
	});

	// esc out of dialog
	window.addEventListener('keydown', (evt) => {
		if (evt.key == "Escape") {
			if (cube.classList.contains("flipped")) {
				pilfEdReppilf();
			}
		}
	});
};


//////////
// HELPERS
//////////
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}


////////////////
// INITIALISATIE
////////////////
iniMoodChange();
iniMoveGlimmer();
iniFlipperDeFlip();