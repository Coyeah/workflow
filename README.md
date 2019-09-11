# workflow - 工作流

结合 `链表` 与 `图` 的数据结构，称之为工作流。主要解决是流程化的数据结构，及其渲染。

## 为什么不是链表？

在开发过程中，尝试使用链表的方式去完成工作流的需求，工作流特殊性在于仅有一个开始与结束，而中间流程中存在不同的路径完成一个工作流。而链表是单向且单链，过程中处理分支方面能力不强，因此融入了图的结构，让每一个 `node` 都能指向四个方向，提高数据的机动性。

## 开发结构思想

工作流中仅仅保存一个id，利用 `context` 传递数据字典，组件通过数据字典及对应id获取详细的渲染数据，减少工作流的数据承载量。

# If~

If you like it. Please give me a little encouragement. Star it >> [ [github project](https://github.com/Coyeah/workflow) ]

If you something doesn’t work, please [file an issue](https://github.com/Coyeah/workflow/issues).

# about cli

A projcet with `Webpack` and `React`, this allows you to quickly get into a state of development.

You can use [oops-cli](https://github.com/Coyeah/oops-project) to quickly create.