kaboom({
	global: true,
	width: 160,
	height: 120,
	scale: 4,
	debug: false,
	plugins: [asepritePlugin,],
});

loadRoot("/lib/");
loadSprite("car", "./assets/img/dbcar4.png")
loadSprite("sky", "./assets/img/sky.png");
loadSprite("road", "./assets/img/road.png");
loadSprite("stop", "./assets/img/stop.png");
loadSprite("lahat", "./assets/img/lahat.png");
loadSound("pullup", "./assets/sounds/ipullup.mp3")
loadSound("lessgo", "./assets/sounds/lessgo.mp3")



scene("main", () => {

	play("pullup")
	layers([
		"bg",
		"game",
		"ui",
	], "game");

	const upBound = 40;
	const lowBound = height() - 12;
	const speed = 90;
	let speedMod = 2;

	add([
		sprite("sky"),
		layer("bg"),
	]);

	// TODO: make helper for inf scroll backgrounds
	// scrolling road (2 sprites cycling)
	add([
		sprite("road"),
		pos(0, 0),
		layer("bg"),
		"road",
	]);

	add([
		sprite("road"),
		pos(width() * 2, 0),
		layer("bg"),
		"road",
	]);

	action("road", (r) => {
		r.move(-speed * speedMod, 0);
		if (r.pos.x <= -width() * 2) {
			r.pos.x += width() * 4;
		}
	});

	// player
	const car = add([
		sprite("car"),
		pos(24, height() / 2),
		color(),
		origin("center"),
		area(vec2(-12, -6), vec2(12, 8)),
		{
			speed: 120,
		},
	]);


	const stacks = add([
		text("0", 4),
		pos(4, 4),
		layer("ui"),
		{
			value: 0,
		},
	]);
	

	// obj spawn
	loop(2.3, () => {
		const obj = choose([
			"lahat",
		]);
		add([
			sprite(obj),
			"obj",
			obj,
			pos(width(), rand(lowBound, upBound)),
		]);
	});


	loop((Math.random() * 4.1) + 0.8, () => {
		const obj = choose([
			"stop"
		]);
		add([
			sprite(obj),
			"obj",
			obj,
			pos(width(), rand(lowBound, upBound)),
		]);
	});
	


	action("obj", (o) => {
		o.move(-speed * speedMod, 0);
		stacks.value += 1
		speedMod += 0.001
		if (o.pos.x <= -width()) {
			destroy(o);
		}
	});

	// collision resolution
	car.collides("stop", (a) => {
		destroy(a);
		go("death", stacks.value);
	});

	car.collides("lahat", (a) => {
		destroy(a);
		stacks.value += 200;
		play("lessgo")
		speedMod += 3
		wait(3, () => speedMod -= 3)
	});



	stacks.action(() => {
		if (speedMod < 1) {
			stacks.value -= 2;
		} else if (speedMod > 1) {
			stacks.value += 1;
		}
		stacks.text = `stacks: \$${stacks.value}`;
	});

	// input
	keyDown("up", () => {
		if (car.pos.y > upBound) {
			car.move(0, -car.speed);
		}
	});

	keyDown("down", () => {
		if (car.pos.y < lowBound) {
			car.move(0, car.speed);
		}
	});

});

scene("death", (score) => {

	add([
		text(`Final Score: \$${score}`, 4),
		pos(60, 20)
	]);

	add([
		text("press spacebar to play again", 4),
		pos(40, 40),
	]);

	keyPress("space", () => {
		go("main");
	});

});

scene("menu", () => {
	add([
		text('DaBaby ii:', 4),
		pos(80, 60),
	]);

	add([
		text('this time its personal', 4),
		pos(55, 70)
	])

	add([
		text("press spacebar to play", 4),
		pos(55, 85),
	]);
	// all events are bound to a scene
	keyPress("space", () => {
		go("main", 0);
	});
})

start("menu");
