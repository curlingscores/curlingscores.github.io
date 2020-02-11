Vue.component ('scoreboard', {
	template: '#scoreboard',
	data: function() {
		return {
			events: [],
			activeEvent: {}
		}
	},
	mounted: function() {
		var self = this;
		$.ajax({
			url: '/test-files/featured.json',
			method: 'GET',
			success: function(data){
				self.events = data.data;
				self.activeEvent = data.data[0];
			},
			error: function(error){
				console.log(error);
			}
		})
	}
});

Vue.component ('event', {
	template: '#event',
	props: ['event']
});

Vue.component ('scores', {
	template: '#scores',
	props: ['activeEvent'],
	data: function() {
		return {
			currentDraw: {}
		}
	},
	watch:  {
		activeEvent: function(newVal, oldVal) {
			var self = this;
			var activeEventId = newVal.eventId;  //Not being used yet but would be in production
			console.log('Prop changed: ', newVal, ' | was: ', oldVal)
			$.ajax({
				url: '/test-files/event-games.json',
				method: 'GET',
				success: function(data){
					self.currentDraw = getCurrentDraw(data);
				},
				error: function(error){
					console.log(error);
				}
			});
		}
	}
})

var app = new Vue({
	el: "#app"
});

function getCurrentDraw(draws){
	var minDifference = Number.MAX_SAFE_INTEGER;
	currentDate = new Date();
	console.log(draws)
	for(var i = 0; i < draws.length; i++){
		drawDate = new Date(draws[i].startsAt * 1000);
		console.log(drawDate);
		var dateDifference = drawDate - currentDate;
		console.log(dateDifference);
	}
}