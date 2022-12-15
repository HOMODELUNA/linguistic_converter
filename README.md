# Linguistic Converter

这是一个造语辅助工具,提供**字典格式**和**演化函数**,用于制作复杂的演化器

基础的函数定义在`Dictionary.ts`中,第一个,也是作为样例的演化器,是`converters/pa_tenyomi.ts`

重点是转换器的定义:
```typescript
type WordConverter = (source:Word) => Word;
type DictConverter = (source:Dictionary) => Dictionary;
```

这种定义方便转换器就组合起来,构成更大,更复杂,更真实的转换

用例:
```js
import {Dictionary} from "./Dictionary"
import {pa_tenyomi} from "./converter/pa_temyomi"
const converter = pa_tenyomi(1.0) //制作出了一个转换器
const output = Dictionary.from_yaml(YAML字符串)//读取
                         .into(converter)//转换
				         .to_yaml() //输出为字符串
```