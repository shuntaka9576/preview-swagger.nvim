function! pswag#autocmd#init() abort
  execute 'augroup PSWAG_REFRESH_INIT' . bufnr('%')
    autocmd!
    autocmd BufEnter *.{yml,yaml,json} :call pswag#util#preview_swag()
    autocmd BufWritePost <buffer> :call pswag#rpc#refresh_content()
    autocmd CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> :call pswag#rpc#refresh_content()
  augroup END
endfunction
