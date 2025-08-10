class Util {

    isNotEmpty(str: string) {

        return str != null && str.length > 0;
    }

    isEmpty(string: string | any[] | null) {
        return string == null || string.length === 0;
    }
}

export default new Util()
