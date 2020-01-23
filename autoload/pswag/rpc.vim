let s:pswag_channel_id = -1

function! s:on_stdout(chan_id, msgs, ...) abort
  call pswag#util#echo_messages('Error', a:msgs)
endfunction
function! s:on_stderr(chan_id, msgs, ...) abort
  call pswag#util#echo_messages('Error', a:msgs)
endfunction
function! s:on_exit(chan_id, code, ...) abort
  let s:pswag_channel_id = -1
  " let g:pswag_node_channel_id = -1
endfunction

function! pswag#rpc#server_status()
  if s:pswag_channel_id ==# -1
    return -1
  endif
  return 1
endfunction

function! pswag#rpc#start_server()
  let job_cmd = pswag#util#job_command()

  let s:pswag_channel_id = jobstart(job_cmd, {
        \ 'on_stdout': function('s:on_stdout'),
        \ 'on_stderr': function('s:on_stderr'),
        \ 'on_exit': function('s:on_exit')
        \ })
endfunction

function! pswag#rpc#stop_server()
  if s:pswag_channel_id !=# -1
     try
       call jobstop(s:pswag_channel_id)
     catch /.*/
     endtry
  endif
  echo 's:pswag_channel_id' . s:pswag_channel_id
  echo 'g:pswag_node_channel_id' . g:pswag_node_channel_id
  let s:pswag_channel_id = -1
  let g:pswag_node_channel_id = -1
endfunction

function! pswag#rpc#open_browser()
  if exists('g:pswag_node_channel_id') && g:pswag_node_channel_id !=# -1
    call rpcnotify(g:pswag_node_channel_id, 'open_browser', { 'bufnr': bufnr('%') })
  endif
endfunction

function! pswag#rpc#refresh_content()
  if exists('g:pswag_node_channel_id') && g:pswag_node_channel_id !=# -1
    call rpcnotify(g:pswag_node_channel_id, 'refresh_content', { 'bufnr': bufnr('%') })
  endif
endfunction

