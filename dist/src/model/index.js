const apps = [
    {
        name: 'yueqi1',
        domain: "http://localhost:8080",
        activeWhen: function (location) {
            return location.hash === '#/home';
        },
        routes: [],
        status: 'NOT_LOADED',
        entry: '/rcms/stats111.js',
        init: (instance) => {
            alert(instance);
        }
    }
];
export default apps;
//# sourceMappingURL=index.js.map