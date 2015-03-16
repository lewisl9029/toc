describe 'XMLHttpRequest', ->
  describe 'when redirected', ->
    beforeEach ->
      @xhr = new XMLHttpRequest

    it 'issues a GET for the next location', (done) ->
      @xhr.open 'POST', 'https://localhost:8911/_/redirect/302/method'
      @xhr.onload = =>
        expect(@xhr.responseText).to.match(/GET/i)
        done()
      @xhr.send 'This should be dropped during the redirect'

    it 'does not return the redirect headers', (done) ->
      @xhr.open 'GET', 'https://localhost:8911/_/redirect/302/method'
      @xhr.onload = =>
        expect(@xhr.getResponseHeader('Content-Type')).to.equal 'text/plain'
        expect(@xhr.getResponseHeader('X-Redirect-Header')).not.to.be.ok
        done()
      @xhr.send()

    it 'persists custom request headers across redirects', (done) ->
      @xhr.open 'GET', 'https://localhost:8911/_/redirect/302/headers'
      @xhr.setRequestHeader 'X-Redirect-Test', 'should be preserved'
      @xhr.onload = =>
        expect(@xhr.responseText).to.match(/^\{.*\}$/)
        headers = JSON.parse @xhr.responseText
        expect(headers['connection']).to.equal 'keep-alive'
        expect(headers).to.have.property 'host'
        expect(headers['host']).to.equal 'localhost:8911'
        expect(headers).to.have.property 'x-redirect-test'
        expect(headers['x-redirect-test']).to.equal 'should be preserved'
        done()
      @xhr.send()

    it 'drops content-related headers across redirects', (done) ->
      @xhr.open 'POST', 'https://localhost:8911/_/redirect/302/headers'
      @xhr.setRequestHeader 'X-Redirect-Test', 'should be preserved'
      @xhr.onload = =>
        expect(@xhr.responseText).to.match(/^\{.*\}$/)
        headers = JSON.parse @xhr.responseText
        expect(headers['connection']).to.equal 'keep-alive'
        expect(headers).to.have.property 'host'
        expect(headers['host']).to.equal 'localhost:8911'
        expect(headers).to.have.property 'x-redirect-test'
        expect(headers['x-redirect-test']).to.equal 'should be preserved'
        expect(headers).not.to.have.property 'content-type'
        expect(headers).not.to.have.property 'content-length'
        done()
      @xhr.send 'This should be dropped during the redirect'



