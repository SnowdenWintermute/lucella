echo compiling protobuf to ts/js && protoc \
 --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" \
--js_out="import_style=commonjs,binary:./dist/proto/generated" \
 --ts_out="./src/proto/generated" \
 ./src/proto/deltas.proto && protoc \
 --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" \
--js_out="import_style=commonjs,binary:./dist/proto/generated" \
 --ts_out="./src/proto/generated" \
 ./src/proto/client-inputs.proto

