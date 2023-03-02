async function get_coordinates(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0) {
    const latitude = data[0].lat;
    const longitude = data[0].lon;
    return [latitude, longitude];
  } else {
    return null;
  }
}

async function get_shabbat_timings(latitude, longitude) {
  const url = `https://www.hebcal.com/shabbat?cfg=json&geo=pos&latitude=${latitude}&longitude=${longitude}`;
  const response = await fetch(url);
  const data = await response.json();
  const candle_lighting = data.items[0].title;
  const havdalah = data.items[3].title;
  return `${candle_lighting}, ${havdalah}.`;
}

const form = document.querySelector("form");
const result = document.getElementById("result");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const city = document.getElementById("city").value;
  const coordinates = await get_coordinates(city);
  if (coordinates !== null) {
    const [latitude, longitude] = coordinates;
    const shabbat_timings = await get_shabbat_timings(latitude, longitude);
    result.textContent = shabbat_timings;
  } else {
    result.textContent = `Could not find coordinates for ${city}`;
  }
});
