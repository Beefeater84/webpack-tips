export default class Article {
  constructor(title, logo) {
    this.logo = logo
    this.title = title;
    this.date = Date.now();
  }

  meta() {
    return JSON.stringify({
      title: this.title,
      logo: this.logo,
      date: this.date
    })
  }
}