/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
 test('Test GET /api/books',  function(done){
  chai.request(server)
    .get('/api/books')
    .end(function(err, res){
      assert.equal(res.status, 200);
      assert.isArray(res.body, 'response should be an array');
      assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
      assert.property(res.body[0], 'title', 'Books in array should contain title');
      assert.property(res.body[0], '_id', 'Books in array should contain _id');
      done();
    });
});
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    let ID;
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test-title" })
            .end(function (err, res) {
              ID = res.body._id;
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "test-title");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "it is an array");
         
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/invalid")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${ID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, ID);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post(`/api/books/${ID}`)
            .send({ comment: "Test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, ID);
              assert.include(res.body.comments, "Test");
              assert.equal(res.body.commentcount, 1);
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${ID}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post(`/api/books/invalid`)
            .send({ comment: "Test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${ID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/invalid`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          });
      });
    });
  });
});
