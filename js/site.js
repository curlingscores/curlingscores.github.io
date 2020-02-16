var isDevelopmentEnvironment = false;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
	isDevelopmentEnvironment = true;
}
var baseApiUrl = 'http://159.203.35.195';


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Vue.component ('scoreboard', {
	template: '#scoreboard',
	data: function() {
		return {
			events: [],
			activeEvent: {},
			eventIsActive: false
		}
	},
	mounted: function() {
		var self = this;
		$.ajax({
			url: getFeaturedUrl(isDevelopmentEnvironment),
			method: 'GET',
			dataType: 'json' + (!isDevelopmentEnvironment ? 'p' : ''),
			success: function(data){
				var parsedData = JSON.parse(data.contents);
				self.events = parsedData.data;
				self.activeEvent = parsedData.data[0];
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
			linescoreIsActive: false,
			loading: false
		}
	},
	watch:  {
		activeEvent: function(newVal, oldVal) {
			var self = this;
			var activeEventId = newVal.eventId;  //Not being used yet but would be in production
			self.loading = true;
			$.ajax({
				url: getEventGamesUrl(activeEventId, isDevelopmentEnvironment),
				method: 'GET',
				dataType: 'json' + (!isDevelopmentEnvironment ? 'p' : ''),
				success: function(data){
					var parsedData = JSON.parse(data.contents);
					self.currentDraw = getCurrentDraw(parsedData);
					self.draws = parsedData;
					self.loading = false;
				},
				error: function(error){
					console.log(error);
					self.loading = false;
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

function getEventGamesUrl(eventId, isDevelopmentEnvironment){
	if (isDevelopmentEnvironment) {
		return '/test-files/game' + (Math.floor(Math.random() * Math.floor(3))) + '-jsonp.json';
	}
	return getReverseProxyUrl(baseApiUrl + '/events/' + eventId + '/draws');
}

function getFeaturedUrl(isDevelopmentEnvironment){
	if (isDevelopmentEnvironment){
		return '/test-files/featured-jsonp.json';
	}
	return getReverseProxyUrl(baseApiUrl + '/featured');
}

function getReverseProxyUrl(url){
	return 'http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?';
}