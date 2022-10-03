
module.exports = {
    persistData(key, value) {
        console.log("Persisting data");
       
        try {
            if (JSON.parse(window.localStorage.getItem(key)) != null) {
                window.localStorage.setItem(key, JSON.stringify(value));
                return true
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
                return true
            }
        } catch (error) {
            console.log(error);
        }
    },
    getData(key) {
        try {
            return JSON.parse(window.localStorage.getItem(key));
        } catch (error) {

        }
    },
    removeData(key) {
        try {
            window.localStorage.removeItem(key);
            return true
        } catch (error) {
            return false
        }
    },
    setData(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true
        } catch (error) {
            return false
        }
    },
}

