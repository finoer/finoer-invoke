## 设计文档
### 注册应用

从应用列表中注册应用

project： 应用信息

```js
class Projects {
	name: "";
	activeWhen: () => '/home';
	routes: [
    
  ],
	entry: "./app1",
  status: '',
}
```

projects: 应用列表

```js
[
  project1, 
  project2, 
  project3,
]
```



### invoke 调度

routerchange-hashChange

```
onHashChange(() => {
	invoke.performesApp()
})
```

invoke

根据路由匹配到的项目信息， 

```
performaceChange(app, router) {
	// 卸载之前的app
	// 加载新的app
	// 先加载运行环境， 
	// 然后加载依赖
	// 渲染页面
}
```

app的状态管理

```

```

