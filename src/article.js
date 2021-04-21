export default class Article {
  constructor(title) {
    this.title = title;
    this.date = Date.now();
  }

  meta() {
    return JSON.stringify({
      title: this.title,
      date: this.date
    })
  }
}