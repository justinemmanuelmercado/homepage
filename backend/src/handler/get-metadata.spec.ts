import {GetMetadata} from "./get-metadata";
import 'mocha';
import { assert, match, spy, stub, SinonStub, restore } from "sinon";

describe('GetMetadata', async () => {
    let req, res: any, expected: any, func: any;
    beforeEach(() => {
        stub(console, "error")
        let statusStub = stub();
        let jsonStub = stub();

        res = {
            json: jsonStub.returns({ status: statusStub}),
            status: statusStub.returns({ json: jsonStub})
        };

        expected = {
            url: "http://www.exampl4e.com",
            thumbnail: "http://www.example.com/example.jpg"
        };

        func = GetMetadata.get;
    })

    it(('should return the metadata from a valid URL'), async () => {
        stub(GetMetadata, 'scrape').resolves(expected)

        req = {
            params: {
                url: "https://www.example.com"
            }
        }

        await func(req, res);
        assert.calledWith((GetMetadata.scrape as SinonStub), req.params.url)
        assert.calledWith(res.status, match(200));
        assert.calledWith(res.json, expected);
    })

    it(('should throw an error for invalid URLs and not call scraper'), async () => {
        req = {
            params: {
                url: "I'm not url"
            }
        }

        stub(GetMetadata, 'scrape')
        await func(req, res);
        assert.notCalled((GetMetadata.scrape as SinonStub));
        assert.calledWith(res.status, match(422));
        assert.calledWith(res.json, match.has("message", match.string))
    })

    afterEach(() => {
        restore();
    })
})