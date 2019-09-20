import runApp from "./app";
import request from 'supertest';

describe('Server', async () => {
    let app: any;
    before(async () => {
        app = await runApp();
    })

    it('should send back connection name if server is running successfully', (done) => {
        request(app)
            .get('/')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                message: "congrats",
                name: "default"
            })
            .end(done);
    });
})