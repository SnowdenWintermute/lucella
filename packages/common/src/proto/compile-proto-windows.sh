protoc ./src/proto/deltas.proto --plugin=protoc-gen-ts=.\\node_modules\\.bin\\protoc-gen-ts.cmd --js_out=import_style=commonjs,binary:./dist/proto/generated --ts_out=./src/proto/generated && protoc ./src/proto/client-inputs.proto --plugin=protoc-gen-ts=.\\node_modules\\.bin\\protoc-gen-ts.cmd --js_out=import_style=commonjs,binary:./dist/proto/generated --ts_out=./src/proto/generated
