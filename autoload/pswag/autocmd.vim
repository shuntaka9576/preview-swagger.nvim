function! pswag#autocmd#init() abort
  execute 'augroup PSWAG_REFRESH_INIT' . bufnr('%')
    autocmd!
    autocmd BufWritePost <buffer> :call pswag#rpc#refresh_content()
    autocmd CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> :call pswag#rpc#refresh_content()
  augroup END
endfunction
