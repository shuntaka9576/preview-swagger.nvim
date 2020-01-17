# preview-swagger.nvim
It is possible to preview with [SwaggerUI](https://swagger.io/tools/swagger-ui) in real time! 

![preview](https://user-images.githubusercontent.com/12817245/72663783-a2607a00-3a39-11ea-8926-8d26e48068a5.gif)

## Features
* [x] Excute the :SwaggerPreview commannd and preview the yaml swagger configuration file in real time with SwaggerUI
* [ ] JSON configuration
* [ ] AutoScroll

## Requirements
* Neovim
* Node.js("node" command in $PATH)

## Install & Usage
install with [dein](https://github.com/Shougo/dein.vim.git)
```vim
" .vim config
call dein#add('shuntaka9576/preview-swagger.nvim', { 'build': 'yarn install' } )
```
```toml
# .toml config
[[plugins]]
repo = 'shuntaka9576/preview-swagger.nvim'
build = 'yarn install'
```

command
```
:SwaggerPreview
```

## Config
```
" set to node path
" default "node" command in $PATH
let g:pswag_node_path = '~/.anyenv/envs/nodenv/shims/node'

" set to lunch port
" default 9126
let g:pswag_lunch_port='6060'

" set to lunch address
" default 127.0.0.1
let g:pswag_lunch_ip='xxx.x.x.xx'
```

## Contribution
```
export NVIM_PSWAG_LOG_LEVEL=debug
export NVIM_PSWAG_LOG_FILE=/tmp/pswag.log
yarn install
```
