
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
			currentDraw: {},
			draws: {},
			linescoreIsActive: false
		}
	},
	watch:  {
		activeEvent: function(newVal, oldVal) {
			var self = this;
			var activeEventId = newVal.eventId;  //Not being used yet but would be in production
			$.ajax({
				url: '/test-files/event-games' + ((Math.floor(Math.random() * Math.floor(3))) > 1 ? '2' : '') + '.json',
				method: 'GET',
				success: function(data){
					self.currentDraw = getCurrentDraw(data);
					self.draws = data;
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
	var minDifference = Number.MIN_SAFE_INTEGER;
	currentDate = new Date();
	var closestDraw;
	for(var i = 0; i < draws.length; i++){
		drawDate = new Date(draws[i].startsAt * 1000);
		var dateDifference = drawDate - currentDate;
		if (dateDifference < 0 && dateDifference > minDifference){
			minDifference = dateDifference;
			closestDraw = draws[i];
		}
	}
	console.log(closestDraw);
	return closestDraw;
}
