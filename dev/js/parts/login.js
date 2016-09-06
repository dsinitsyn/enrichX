var greetingModule = (function(){
	var now = new Date(),
		timesOfDay = Math.floor(now.getHours() / 6),
		greetingElement = $('.greeting-text'),
		greetingsArr = ["Good night, ", "Good morning, ", "Good afternoon, ", "Good evening, "];
	greetingElement.html(greetingsArr[timesOfDay]);
})();