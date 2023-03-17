// feedback que no rompz el flow. Ver autores TDD
class MarkDownTransform {
    parse(input: string): string {
        const lines = input.split('\n')

        const expressionRegular = /(.*)\[(.+)\]\((.+)\)(.*)/
        const text: string[] = []
        const footer: string[] = []
        let anchorNumber = 0;
        lines.forEach((line) => {
            const textMatched = line.match(expressionRegular)
            if (textMatched) {
                anchorNumber = anchorNumber + 1
                footer.push(`[^anchor${anchorNumber}]: ` + textMatched[3])
                text.push(textMatched[1] + textMatched[2] + ` [^anchor${anchorNumber}]` + textMatched[4])
            } else {
                text.push(line)
            }
        });
        return text.join('\\n') + '\\n\\n' + footer.join('\\n')
    }
}

describe('Markdown transform should', () => {
    describe('Use a parse and turn link footnotes from single line', () => {
        it('with a link', () => {
            const input = '[visible text link](url)'
            const expectedOutput = 'visible text link [^anchor1]\\n\\n[^anchor1]: url'
            const markDownTransform = new MarkDownTransform()

            const result = markDownTransform.parse(input)

            expect(result).toBe(expectedOutput)
        });

        it('link in the middle', () => {
            const input = '[this book](https://codigosostenible.com) and some other text'
            const expectedOutput = 'this book [^anchor1] and some other text\\n\\n[^anchor1]: https://codigosostenible.com'
            const markDownTransform = new MarkDownTransform()

            const result = markDownTransform.parse(input)

            expect(result).toBe(expectedOutput)
        });

        it('do not begin with link and link in the middle', () => {
            const input = 'Holi, [this book](https://codigosostenible.com) and some other text'
            const expectedOutput = 'Holi, this book [^anchor1] and some other text\\n\\n[^anchor1]: https://codigosostenible.com'
            const markDownTransform = new MarkDownTransform()

            const result = markDownTransform.parse(input)

            expect(result).toBe(expectedOutput)
        });

    })
    describe('Use a parse and turn link footnotes from multiples lines', () => {
        it('do not begin with link and link in the middle', () => {
            const input = '[this book](https://codigosostenible.com) and some other text\n' +
                'and some other text line.'
            const expectedOutput = 'this book [^anchor1] and some other text\\n' +
                'and some other text line.\\n' +
                '\\n' +
                '[^anchor1]: https://codigosostenible.com'
            const markDownTransform = new MarkDownTransform()

            const result = markDownTransform.parse(input)

            expect(result).toBe(expectedOutput)
        });

    })
    describe('Use a parse and turn link footnotes from multiples lines', () => {
        it('do not begin with link and link in the middle', () => {
            const input = '[this book](https://codigosostenible.com) and some other text\n' +
                '[this book2](https://codigosostenible.com2) and some other text\n' +
                'and some other text line.'
            const expectedOutput = 'this book [^anchor1] and some other text\\n' +
                'this book2 [^anchor2] and some other text\\n' +
                'and some other text line.\\n' +
                '\\n' +
                '[^anchor1]: https://codigosostenible.com' +
                '\\n' +
                '[^anchor2]: https://codigosostenible.com2'
            const markDownTransform = new MarkDownTransform()

            const result = markDownTransform.parse(input)

            expect(result).toBe(expectedOutput)
        });

    })


});
