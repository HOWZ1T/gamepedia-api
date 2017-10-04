module.exports.Wiki = class Wiki
{
    constructor(url_, imageURL_, summary_, edits_, contributors_, articles_)
    {
        this.url = url_;
        this.imageURL = imageURL_;
        this.summary = summary_;
        this.edits = edits_;
        this.contributors = contributors_;
        this.articles = articles_;
    }
}