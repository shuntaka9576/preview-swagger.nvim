function! s:start_plugin() abort
  call pswag#autocmd#init()
  command! -buffer SwaggerPreview call pswag#util#preview_swag()
endfunction

function! s:init() abort
  au BufEnter *.{yml,yaml,json} :call s:start_plugin()
endfunction

if !has('nvim')
  call pswag#util#echo_messages('Error', 'only supported by neovim')
  finish
endif
call s:init()
