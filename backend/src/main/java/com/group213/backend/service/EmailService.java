package com.group213.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom("Smart Campus <" + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(msg);
        } catch (Exception e) {
            // log but never fail the caller
            System.err.println("[EmailService] Failed to send to " + to + ": " + e.getMessage());
        }
    }

    public String buildHtml(String title, String body) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f7fa;padding:24px">
              <div style="background:#1B3A72;border-radius:10px 10px 0 0;padding:20px 28px;display:flex;align-items:center;gap:12px">
                <span style="color:white;font-size:20px;font-weight:700;letter-spacing:0.5px">Smart Campus</span>
              </div>
              <div style="background:white;border-radius:0 0 10px 10px;padding:28px 28px 24px;border:1px solid #E5E7EB;border-top:none">
                <h2 style="margin:0 0 16px;font-size:17px;color:#111827">""" + title + """
                </h2>
                <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 24px">""" + body + """
                </p>
                <div style="border-top:1px solid #F3F4F6;padding-top:16px">
                  <p style="color:#9CA3AF;font-size:12px;margin:0">
                    This is an automated message from Smart Campus. Please do not reply.
                  </p>
                </div>
              </div>
            </div>
            """;
    }
}
