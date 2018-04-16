describe('skipped test', function() {

    (true ? it.skip : it)('this one', function() {
        expect('one').toBe('two');
    });
});
